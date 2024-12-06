import { BASE_URL, showSnackbar } from '@/utils/utils'
import { auth } from '../../firebase'




export async function fetchStatRequest(firebase_id_token: string) {

  const url = `${BASE_URL}/stats/`;
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
      return `Error`
    }
    return await response.json()


  }catch(error: any){
    return [];
  }
}



export async function deleteStatRequest(stat: any, firebase_id_token: string) {

  const url = `${BASE_URL}/stats/`;

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
      return `Error deleting inventory item ${stat} : ${response.text()}`
    }

    return 'Success'

  }catch(error: any){
    return `Error deleting inventory item ${stat}: ${error.message}`
  }
}


//function to create a new inventory
export async function createStatRequest(stat: any, firebase_id_token: string){

  const url = `${BASE_URL}/stats/`;

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
      body: JSON.stringify(stat)
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
