import { showSnackbar } from '@/utils/utils'
import { auth } from '../../firebase'
import { supplierURL } from '@/server/services/SupplierHandler'

export const inventoryURL: string = 'http://localhost:8000/inventory/';

export interface InventoryItem {
  product_name: string;
  part_number: number;
  supplier_ID: string;
  manufacturer_ID: string;
  inbound_price: number;
  outbound_price: number;
  reserved: number;
  on_hand: number;
  lead_time: number;
  reorder_point: number;
  stock_level: number;
  status: string;
}

export async function editInventoryRequest(inventory: InventoryItem, firebase_id_token: string){
  const url = inventoryURL + `&firebase_id_token=${firebase_id_token}`;

  //check if authorized inventory
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
      body: JSON.stringify(inventory)
    });

    if(!response.ok){
      return `Error updating inventory: ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error updating inventory: ${error.message}`
  }
}



//method to fetch inventory from the database
export async function fetchInventoryRequest(firebase_id_token: string) {

  const url = inventoryURL + `&firebase_id_token=${firebase_id_token}`

  try{
    const response = await fetch(url, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    });

    if(!response.ok){
      return `Error fetching inventory: ${response.text()}`
    }

    const inventoryList = await response.json()
    return inventoryList;

  }catch(error: any){
    return `Error fetching supplier: ${error.message}`
  }
}



export async function deleteInventoryRequest(part_number: number, firebase_id_token: string) {

  const url = inventoryURL + `${part_number}&firebase_id_token=${firebase_id_token}`;

  //check if authorized inventory
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
      return `Error deleting inventory item ${part_number} : ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error deleting inventory item ${part_number}: ${error.message}`
  }
}


//function to create a new inventory
export async function createInventoryRequest(inventory_item: InventoryItem, firebase_id_token: string){

  const url = inventoryURL + `?firebase_id_token=${firebase_id_token}`;


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
      body: JSON.stringify(inventory_item)
    });

    if(!response.ok){
      return `Error creating inventory: ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error creating inventory ${error.message}`
  }
}
