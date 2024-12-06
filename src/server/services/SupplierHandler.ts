import { showSnackbar } from '@/utils/utils'
import { auth } from '../../firebase'

export const supplierURL: string = 'http://localhost:8000';

export interface Supplier {
  supplier_name: string;
  supplier_id: number;
}




export async function editSupplierRequest(supplier: any, firebase_id_token: string){

  const url = `${supplierURL}/suppliers/${supplier.supplier_id}/`;


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
      body: JSON.stringify(supplier)
    });

    if(!response.ok){
      return `Error updating supplier information: ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error updating supplier information: ${error.message}`
  }
}



//method to fetch supplier from the database
export async function fetchSuppliersRequest(firebase_id_token: string) {

  const url = `${supplierURL}/suppliers/`;

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
      return `Error fetching supplier: ${response.text()}`
    }

    const supplierList = await response.json()
    return supplierList;

  }catch(error: any){
    return `Error fetching supplier: ${error.message}`
  }
}



export async function deleteSupplierRequest(supplier: any, firebase_id_token: string) {

  const url = `${supplierURL}/suppliers/${supplier.supplier_id}/`;

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
      return `Error deleting supplier: ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error deleting supplier: ${error.message}`
  }
}


//function to create a new supplier
export async function createSupplierRequest(supplier: any, firebase_id_token: string){

  const url = `${supplierURL}/suppliers/`;

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
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebase_id_token}`
      },
      body: JSON.stringify(supplier)
    });

    console.log('Response status ', response.status);
    console.log('Response json', await response.json());

    if(!response.ok){
      return `Error creating supplier: ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error creating supplier: ${error.message}`
  }
}
