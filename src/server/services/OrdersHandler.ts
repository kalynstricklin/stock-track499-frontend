import { BASE_URL, showSnackbar } from '@/utils/utils'
import { auth } from '../../firebase'



export interface Order {
  id: number;
  part_number: number;
  supplier_id: number;
  qty: number;
  due_date: string;
  created: string;
  value: number;
  customer_id: string;
  is_outbound: boolean;
  status: string
}

export async function editOrderRequest(order: any, firebase_id_token: string){

  const url = `${BASE_URL}/orders/${order.id}/`

  //check if authorized inventory
  if(!auth.currentUser){
    return 'Unauthorized';
  }

  const token = await auth.currentUser.getIdToken();
  if(token !== firebase_id_token){
    return 'Unauthorized'
  }

  try{
    const response = await fetch(url, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${firebase_id_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order)
    });

    if(!response.ok){
      return `Error updating order ${order.id} : ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error updating order ${order.id} : ${error.message}`
  }
}


export async function fetchOrders(firebase_id_token: string){
  const url = `${BASE_URL}/orders/`

  try{
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${firebase_id_token}`,
        'Content-Type': 'application/json',
      },
    });

    if(!response.ok){
      return `Error fetching orders: ${response.text()}`
    }

    const orderList = await response.json()
    return orderList;

  }catch(error: any){
    return `Error fetching order: ${error.message}`
  }
}


export async function deleteOrderRequest(order: any, firebase_id_token: string) {

  const url = `${BASE_URL}/orders/${order.id}/`
  //check if authorized inventory
  if(!auth.currentUser){
    return 'Unauthorized';
  }

  const token = await auth.currentUser.getIdToken();
  if(token !== firebase_id_token){
    return 'Unauthorized'
  }

  try{
    const response = await fetch(url, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${firebase_id_token}`,
        'Content-Type': 'application/json',
      },
    });

    if(!response.ok){
      return `Error deleting order ${order.id} : ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error deleting order${order.id}: ${error.message}`
  }
}


//function to create a new order
export async function createOrderRequest(order: any, firebase_id_token: string){

  const url = `${BASE_URL}/orders/`
  //check if authorized inventory
  if(!auth.currentUser){
    return 'Unauthorized';
  }

  const token = await auth.currentUser.getIdToken();
  if(token !== firebase_id_token){
    return 'Unauthorized'
  }

  try{
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${firebase_id_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order)
    });

    if(!response.ok){
      return `Error creating order ${order.id} : ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error creating order ${error.message}`
  }
}
