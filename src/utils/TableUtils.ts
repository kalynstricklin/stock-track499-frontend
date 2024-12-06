// import { nextTick } from 'vue'
//
//
//
// export function closeDelete (dialogType: any, editedItem: any, defaultItem: any, editedIndex: any) {
//   dialogType.value = false
//   nextTick(() => {
//     editedItem.value = Object.assign({}, defaultItem.value)
//     editedIndex.value = -1
//   })
// }
//
// export function deleteItem(item: any, data: any, editedItem: any, editedIndex: any, dialogType: any){
//   editedIndex.value = data.value.indexOf(item)
//   editedItem.value = Object.assign({}, item)
//   dialogType.value = true
// }
//
// export function editItem(item: any,editedItem: any, editedIndex: any, data: any, dialogType: any){
//   editedIndex.value = data.value.indexOf(item)
//   editedItem.value = Object.assign({}, item)
//   dialogType.value= true
// }
//
// export function deleteItemConfirm(editedIndex: any, item: any) {
//   if (editedIndex.value !== -1) {
//     item.value.splice(editedIndex.value, 1);
//     closeDelete();
//   }
// }

