import { Matieres } from "../models/Matieres";

interface Iident {
  identifiante: string;
  name: string;
  prix: number;
}
export const Newmatire = async({ identifiante, name, prix }: Iident) => {
  if (!identifiante) return { StatusCode: 401, data: "there isn`t tocken" };
  if (!name || !prix) return { StatusCode: 401, data: "there isn`t name or prix" };
  const findname= await Matieres.find()
  if(!findname) return {StatusCode:401,data:"no reultate finding"}
  const nametires= findname.map((Name)=>Name.name)
  for (let nam of nametires) {
    if(nam==name) {
        return {StatusCode:404,data:"matires already existe"} 
    } 
  }
const insertdata=await Matieres.create({name,prix})
if(!insertdata) return { StatusCode: 401, data: "no data saving" };
await insertdata.save()
return { StatusCode: 200, data: insertdata };
};
