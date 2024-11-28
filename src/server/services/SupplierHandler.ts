import { showSnackbar } from '@/utils/utils'
import { auth } from '../../firebase'

export const supplierURL: string = 'http://localhost:8000/suppliers/';

export interface Supplier {
  supplier_name: string;
  supplier_ID: number;
  created_on: string;
  status: string;
}


export async function editSupplierRequest(supplier: any, firebase_id_token: string){
  const url = supplierURL + `&firebase_id_token=${firebase_id_token}`;

  //check if authorized supplier
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
export async function fetchSuppliersRequest( firebase_id_token: string) {

  const url = supplierURL + `&firebase_id_token=${firebase_id_token}`

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



export async function deleteSupplierRequest(supplier_ID: string, firebase_id_token: string) {

  const url = supplierURL + `${supplier_ID}&firebase_id_token=${firebase_id_token}`;

  //check if authorized supplier
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
      return `Error deleting supplier: ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error deleting supplier: ${error.message}`
  }
}


//function to create a new supplier
export async function createSupplierRequest(supplier: Supplier, firebase_id_token: string){

  const url = supplierURL + `?firebase_id_token=${firebase_id_token}`;


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
      body: JSON.stringify(supplier)
    });

    if(!response.ok){
      return `Error creating supplier: ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error creating supplier: ${error.message}`
  }
}
