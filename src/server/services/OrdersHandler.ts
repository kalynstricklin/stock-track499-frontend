import { showSnackbar } from '@/utils/utils'
import { auth } from '../../firebase'

export const orderUrl: string = 'http://localhost:8000/order/';

export interface Order {
  product_name: string;
  PO_number: number;
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
  customer_ID: string;
  total_cost: number;
}

export async function editOrderRequest(order: any, firebase_id_token: string){
  const url = orderUrl;

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
      headers: {
        Authorization: `Bearer ${firebase_id_token}`,
        'Content-Type': 'application/json',
      },
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


export async function fetchOrderRequest(firebase_id_token: string){
//method to fetch order from the database
  const url = orderUrl

  try{
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${firebase_id_token}`,
        'Content-Type': 'application/json',
      },
    });

    if(!response.ok){
      return `Error fetching order: ${response.text()}`
    }

    const orderList = await response.json()
    return orderList;

  }catch(error: any){
    return `Error fetching order: ${error.message}`
  }
}

export async function fetchItemDetails(order: any, firebase_id_token: string){
  const url = `http://localhost:8000/inventory?part_number=${order.part_number}`;

  try{
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${firebase_id_token}`,
        'Content-Type': 'application/json',
      },
    });

    if(!response.ok){
      return `Error fetching item details: ${response.text()}`
    }

    const itemDetails = await response.json()
    return itemDetails;

  }catch(error: any){
    return `Error fetching item details: ${error.message}`
  }
}

export async function deleteOrderRequest(order_id: number, firebase_id_token: string) {

  const url = orderUrl + `${order_id}`;

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
      headers: {
        Authorization: `Bearer ${firebase_id_token}`,
        'Content-Type': 'application/json',
      },
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

  const url = orderUrl ;


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
      headers: {
        Authorization: `Bearer ${firebase_id_token}`,
        'Content-Type': 'application/json',
      },
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
