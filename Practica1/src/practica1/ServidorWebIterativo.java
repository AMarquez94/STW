/**
 * Autor: Alejandro Marquez Ferrer (566400)
 * 
 * Descripcion: Este fichero contiene el codigo correspondiente a un servidor
 * 		Web iterativo. El servidor se encarga de escuchar a los clientes que
 * 		se conecten a su IP y puerto, y atiende peticiones GET. Envia el fichero
 * 		pedido por el cliente con la cabecera HTML correspondiente. Estan 
 * 		implementados los tipos .html y .gif (en caso contrario, lo marca como
 * 		desconocido). Tambien es capaz de gestionar algunos errores:
 * 			-Si el cliente pide un fichero no existente, el servidor le envia un
 * 		error 404.
 * 			-Si el cliente pide un fichero en un directorio padre al del servidor,
 * 		le envia un error 400.
 * 			-Si el cliente envia una peticion distinta de GET, el servidor le envia
 * 		un error 501.
 * 
 * Codigo adaptado del proporcionado en el enunciado
 * 	
 */

package practica1;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.UnknownHostException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Scanner;

public class ServidorWebIterativo {

	/* Constantes empleadas */
	private static final int PUERTO = 9001;
	
	private static final String VERSION = "HTTP/1.0";
	private static final String OK = VERSION + " 200 OK\n";
	private static final String BAD_REQUEST = "400 Bad Request";
	private static final String NOT_FOUND = "404 Not Found";
	private static final String NOT_IMPLEMENTED = "501 Not Implemented";
	
	/* Ruta del servidor */
	private static final String DIR = Paths.get(".").toAbsolutePath().normalize().toString();
	
	/**
	 * Inicia el servidor iterativo para atender las peticiones get
	 * de maximo un cliente a la vez.
	 */
	public static void main(String args[]) throws UnknownHostException, IOException{
		
		byte[] buffer = new byte[1024];
		ServerSocket servidor = new ServerSocket(PUERTO);

		while(true){
			
			/* Espero a que venga un cliente */
			Socket cliente = servidor.accept();
			
			procesarPeticion(cliente, buffer);
			
			cliente.close();
		}
	}
	
	/**
	 * Se encarga de procesar la peticion del cliente, de acuerdo al funcionamiento
	 * explicado en la cabecera del codigo.
	 */
	public static void procesarPeticion(Socket cliente, byte[] buffer){
		
		int bytes;
		
		/* Nos aseguramos de que el fin de linea se ajuste al estandar */
		System.setProperty("line.separator", "\r\n");
		
		try {
			Scanner lee = new Scanner(cliente.getInputStream());
			PrintWriter escribe = new PrintWriter(cliente.getOutputStream(),true);

			if(lee.hasNext()){
				
				/* Esto debe ser el GET */
				String peticion = lee.next();
				if(peticion.equals("GET")){
					
					/* Esto es el fichero */
					String fichero = "." + lee.next();
					
					/* Comprobamos si existe */
					FileInputStream fis = null;
					boolean existe = true;
					
					try{
						fis = new FileInputStream(fichero);
					} catch (FileNotFoundException e){
						existe = false;
					}
					
					if (existe){
						File f = new File(fichero);
						/* Comprobamos si esta en la ruta correcta */
						if(isChild(f.getAbsolutePath()) && fichero.length() > 2){
							while((bytes = fis.read(buffer)) != -1){
								
								/* Enviar cabecera */
								escribe.println(escribirCabecera(f));
								
								/* Enviar fichero */
								cliente.getOutputStream().write(buffer,0,bytes);
							}
						} else{
							
							/* Peticion erronea */
							escribe.println(enviarError("BAD_REQUEST"));
						}
					} else{
						
						/* Fichero no encontrado */
						escribe.println(enviarError("NOT_FOUND"));
					}
					
				} else{
					
					/* La peticion del cliente no es GET */
					escribe.println(enviarError("NOT_IMPLEMENTED"));
				}
			}
			
			lee.close();
			
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * Dada la ruta de un directorio, devuelve true si es hijo del directorio del
	 * servidor. En caso contrario, devuelve false
	 */
	private static boolean isChild(String child){
		try{
			Path parent = Paths.get(DIR).toRealPath();
			Path possibleChild = Paths.get(child).toRealPath();
			return possibleChild.startsWith(parent);
			
		} catch(IOException e){
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * Devuelve la cabecera correspondiente al fichero f en caso de que la peticion
	 * haya sido correcta. Concretamente, especifica la version de HTTP y la cabecera 
	 * con los datos acerca del tipo de contenido y longitud del contenido.
	 * @param f
	 * @return
	 */
	private static String escribirCabecera(File f){
		String contentype = "Content-Type: " + escribirContentType(obtenerExtension(f)) + "\n";
		String contentlength = "Content-Length: " + f.length() + "\n";
		return OK + contentype + contentlength ;
	}
	
	/**
	 * Dada una extension, devuelve el tipo de contenido que le corresponde (html/gif/desconocido)
	 */
	private static String escribirContentType(String extension){
		String contentype = "";
		if(extension.equalsIgnoreCase(".htm") || extension.equalsIgnoreCase(".html")){
			contentype = "text/html";
		} else if(extension.equalsIgnoreCase(".gif")){
			contentype = "image/gif";
		} else{
			contentype = "application/octet-stream";
		}
		return contentype;
	}
	
	/**
	 * A partir de un fichero, devuelve la extension del mismo
	 */
	private static String obtenerExtension(File f){
	    String nombre = f.getName();
	    try {
	        return nombre.substring(nombre.lastIndexOf("."));
	    } catch (Exception e) {
	        return "";
	    }
	}
	
	/**
	 * Devuelve el codigo html correspondiente a una peticion erronea (por cualquiera
	 * de las razones comentadas en la cabecera del codigo)
	 */
	private static String enviarError(String error){
		String bodyError = "";
		String respuesta = "";
		if(error.equals("BAD_REQUEST")){
			bodyError = BAD_REQUEST;
		} else if(error.equals("NOT_FOUND")){
			bodyError = NOT_FOUND;
		} else if(error.equals("NOT_IMPLEMENTED")){
			bodyError = NOT_IMPLEMENTED;
		}
		respuesta = respuesta + VERSION + " " + bodyError + "\nContent-Type: text/html ";
		String body = "<html><body><h1>" + bodyError + "</h1></body></html>";
		respuesta = respuesta + "Content-Length: " + body.length() + "\n\n\n" + body;
		return respuesta;
	}
}
