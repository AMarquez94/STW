/**
 * Autor: Alejandro Marquez Ferrer (566400)
 * 
 * Descripcion: Este fichero contiene el codigo correspondiente al thread lanzado
 * 		por el servidor web. Este hilo se encarga de atender peticiones GET. 
 * 		Envia el fichero pedido por el cliente con la cabecera HTML correspondiente.
 * 		Estan implementados los tipos .html y .gif (en caso contrario, lo marca como
 * 		desconocido). Tambien es capaz de gestionar algunos errores:
 * 			-Si el cliente pide un fichero no existente, el thread le envia un
 * 		error 404.
 * 			-Si el cliente pide un fichero en un directorio padre al del servidor,
 * 		le envia un error 400.
 * 			-Si el cliente envia una peticion distinta de GET, el thread le envia
 * 		un error 501.
 * 		Una vez atendida la peticion del cliente, el thread es destruido.
 */
package practica1;

import java.io.IOException;
import java.net.Socket;

public class PeticionHTTP extends Thread{
	
	private Socket cliente;
	
	public PeticionHTTP(Socket cliente){
		this.cliente = cliente;
	}
	
	public void run(){
		
		byte[] buffer = new byte[1024];
		
		/* Se procesa la peticion del cliente */
		ServidorWebConcurrente.procesarPeticion(cliente, buffer);
		
		try {
			cliente.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
