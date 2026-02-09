import axios from "axios"

export const checkStudentID=async(user_id,intake)=>{
    const res=await axios.get(`https://bubt.edu.bd/global_file/getData.php?id=${user_id}&type=stdVerify`) 
    //console.log(res)
    if(!res.data){
        throw new Error("Incorrect Student ID")
    }
    if(res.data.sis_std_Status!=='R'){
        throw new Error("Not a Running Student of BUBT")
    }
    if(res.data.sis_std_intk!==intake){
        throw new Error("Incorrect Student Intake")
    }
    return Object.fromEntries(
        Object.entries(res.data).filter(([key]) => key !== 'gazo')
    )
}