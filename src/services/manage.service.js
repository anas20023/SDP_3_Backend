import NodeCache from "node-cache"
import Users from "../model/users.js"
import suggestions from "../model/suggestions.js"
const cache = new NodeCache({ stdTTL: 60 })
export const getusers = async () => {
    const cachedUsers = cache.get("users")
    if (cachedUsers) {
        return cachedUsers
    }
    const users = await Users.find().select('-passwordHash')
    cache.set("users", users)
    return users
}
export const getAnalytics = async () => {
    const cachedData = cache.get("last_30_days")
    if (cachedData) {
        return cachedData
    }
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const users = await Users.find({ createdAt: { $gte: thirtyDaysAgo } }).select('-passwordHash')

    const analytics = Array.from({ length: 32 }, (_, i) => {
        const dayStart = new Date(thirtyDaysAgo)
        dayStart.setDate(dayStart.getDate() + i)
        dayStart.setHours(0, 0, 0, 0)

        const dayEnd = new Date(dayStart)
        dayEnd.setHours(23, 59, 59, 999)

        const cdayUsers = users.filter(u => u.createdAt >= dayStart && u.createdAt <= dayEnd)
        const udayUsers = users.filter(u => u.updatedAt >= dayStart && u.updatedAt <= dayEnd)

        return {
            id: i + 1,
            cc: cdayUsers.length,
            uc: udayUsers.length,
            "created_at": dayStart,
            day: dayStart.toISOString().split('T')[0]
            ,
            "display_date": dayStart.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
        }
    })

    cache.set("last_30_days", analytics)
    return analytics
}
export const getsuggestionAnalysis = async () => {
    const res = await suggestions.find().select('status')
    // console.log(res)
    return [
        {
            name:"pending",value: res.filter(item => item.status === 'pending').length,
        },
        {
            name: "approved",value: res.filter(item => item.status === 'approved').length,
        },
        {
           name: "rejected",value: res.filter(item => item.status === 'reject').length
        }
    ]
}
export const getstarAnalysis=async()=>{
    const res=await suggestions.find().select('stars uploaded_by')
    const usersMap = new Map(await Users.find().select('_id name').then(users => users.map(u => [u._id.toString(), u.name])))
    
    return res
        .map(item => ({
            ...item.toObject(),
            uploaded_by: usersMap.get(item.uploaded_by.toString()) || 'Unknown'
        }))
        .sort((a, b) => b.stars - a.stars)
}