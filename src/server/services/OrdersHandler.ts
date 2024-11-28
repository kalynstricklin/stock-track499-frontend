import { showSnackbar } from '@/utils/utils'
import { auth } from '../../firebase'

export const orderUrl: string = 'http://localhost:8000/order/';

export interface Order {
  product_name: string;
  PO_order: number;
  part_number: number;
  qty: number;
  supplier_ID: string;
  manufacturer_ID: string;
  order_date: string;
  due_date: string;
  received_date: string;
  status: string;
  inbound_price: number;
  outbound_price: number;
}

export async function editOrderRequest(order: any, firebase_id_token: string){
  const url = orderUrl + `&firebase_id_token=${firebase_id_token}`;

  //check if authorized order
  if(!auth.currentUser){
    return 'Unauthorized';
  }

  const token = (await (auth.currentUser.getIdTokenResult())).token;
  if(token !== firebase_id_token){
    return 'Unauthorized'
  }

  try{
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(order)
    });

    if(!response.ok){
      return `Error updating order ${order.order_id} : ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error updating order ${order.order_id} : ${error.message}`
  }
}



//method to fetch order from the database
export async function fetchOrdersRequest(firebase_id_token: string) {
  const url = orderUrl + '&firebase_id_token=${firebase_id_token}'

  try{
    const response = await fetch(url, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    });

    if(!response.ok){
      return `Error fetching supplier: ${response.text()}`
    }

    const supplierList = await response.json()
    return supplierList;

  }catch(error: any){
    return `Error fetching supplier: ${error.message}`
  }
}



export async function deleteOrderRequest(order_id: number, firebase_id_token: string) {

  const url = orderUrl + `${order_id}&firebase_id_token=${firebase_id_token}`;

  //check if authorized order
  if(!auth.currentUser){
    return 'Unauthorized';
  }

  const token = (await (auth.currentUser.getIdTokenResult())).token;
  if(token !== firebase_id_token){
    return 'Unauthorized'
  }

  try{
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
    });

    if(!response.ok){
      return `Error deleting order ${order_id} : ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error deleting order${order_id}: ${error.message}`
  }
}


//function to create a new order
export async function createOrderRequest(order: any, firebase_id_token: string){

  const url = orderUrl + `?firebase_id_token=${firebase_id_token}`;


  //check if authorized user
  if(!auth.currentUser){
    return 'Unauthorized';
  }

  const token = (await (auth.currentUser.getIdTokenResult())).token;
  if(token !== firebase_id_token){
    return 'Unauthorized'
  }


  try{
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(order)
    });

    if(!response.ok){
      return `Error creating order ${order.order_id} : ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error creating order ${error.message}`
  }
}
