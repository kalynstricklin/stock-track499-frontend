import { showSnackbar } from '@/utils/utils'

export const API: string = '';



export async function sendRequest(url: string, method: string, body: any= null){
   const requestInit: RequestInit = {
     method,
     headers: { 'Content-Type': 'application/json' },
   }

   //not all requests will have a body
  if(body){
    requestInit.body = JSON.stringify(body);
  }

  try{
    const response = await fetch(url, requestInit);

    if(!response.ok){
      throw new Error(`Failed to fetch resource: ${response.status}`);
    }
    return await response.json();

  }catch(error: any){
    showSnackbar(`Error fetching resource: ${error.message}`, 'error');
    throw error;
  }
}

export async function editItem(endpoint: string, item: any){
  //check if authorized user




  try{
    await sendRequest(`${API}/${endpoint}`, 'PATCH', item);
    showSnackbar('Successfully created.', 'success')
  }catch{
    console.log('error')
  }
}

export async function fetchItem(endpoint: string) {
  return sendRequest(`${API}/${endpoint}`, 'GET')
}

export async function deleteItem(endpoint: string) {
  //check if authorized user




  try{
    sendRequest(`${API}/${endpoint}`, 'DELETE');
    showSnackbar('Successfully deleted.', 'success');
  }catch{
    console.log('error')
  }
}

export async function createItem(endpoint: string, item: any){
  //check if authorized user




  try{
    await sendRequest(`${API}/${endpoint}`, 'POST', item);
    showSnackbar('Successfully created.', 'success')
  }catch{
    console.log('error')
  }
}
