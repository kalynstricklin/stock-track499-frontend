import { showSnackbar } from '@/utils/utils'
import { auth } from '../../firebase'
import { supplierURL } from '@/server/services/SupplierHandler'
import { userURL } from '@/server/services/UserHandler'

export const inventoryURL: string = 'http://localhost:8000';

export interface InventoryItem {
  part_name: string,
  lead_time: number;
  part_number: number;
  supplier_id: number;
  inbound_price: number;
  outbound_price: number;
  reorder_point: number;
  stock_level: number;
}

export async function editInventoryRequest(inventory: any, firebase_id_token: string){

  const url = `${inventoryURL}/inventory/${inventory.part_number}/`;

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

  const url = `${inventoryURL}/inventory/`;

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
      return `Error fetching inventory: ${response.text()}`
    }
    const inventory = await response.json();

    return inventory;


  }catch(error: any){
    return `Error during get request: ${error.message}`
  }
}



export async function deleteInventoryRequest(inventory_item: any, firebase_id_token: string) {

  const url = `${inventoryURL}/inventory/${inventory_item.part_number}/`;

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
      return `Error deleting inventory item ${inventory_item.part_number} : ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error deleting inventory item ${inventory_item.part_number}: ${error.message}`
  }
}


//function to create a new inventory
export async function createInventoryRequest(inventory_item: any, firebase_id_token: string){

  const url = `${inventoryURL}/inventory/`;

  //check if authorized user
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
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebase_id_token}`
      },
      body: JSON.stringify(inventory_item)
    });

    console.log('Response status ', response.status);
    console.log('Response status', await response.json());

    if(!response.ok){
      return `Error creating inventory item: ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error creating inventory ${error.message}`
  }
}
