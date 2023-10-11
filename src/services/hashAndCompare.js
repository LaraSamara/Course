import bcrypt from 'bcrypt';
export const hash = (plainText, saltRound=parseInt(process.env.SALT_ROUND))=>{
    const hashText = bcrypt.hashSync(plainText,saltRound);
    return hashText;
}
export const compare = (plainText,hashText)=>{
    const match = bcrypt.compareSync(plainText,hashText);
    return match;
}