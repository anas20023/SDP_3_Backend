import axios from "axios"

export const checkStudentID = async (user_id, intake) => {
    // console.log(typeof user_id)

    const res = await axios.get(
        `https://bubt.edu.bd/global_file/getData.php?id=${user_id}&type=stdVerify`
    )

    // The API likely returns an array — grab the first element
    const raw = res.data
    const data = Array.isArray(raw) ? raw[0] : raw

    if (!data || !data.sis_std_id) {
        throw new Error("Incorrect Student ID")
    }

    if (data.sis_std_Status !== "R") {
        throw new Error("Not a Running Student of BUBT")
    }

    if (String(data.sis_std_intk) !== String(intake)) {
        throw new Error("Incorrect Student Intake")
    }

    return Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== "gazo")
    )
}