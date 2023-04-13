export default class UserDTO{
    // Over engineering for particular use, but required for hand-in
    constructor(userRaw){
        this.first_name = userRaw.first_name ? userRaw.first_name : "default" 
        this.last_name = userRaw.last_name ? userRaw.last_name : "No last name" 
        this.email = userRaw.email ? userRaw.email : "defaultEmail" 
        this.age = userRaw.age ? userRaw.age : -1 
        this.password = userRaw.password
        this.role = userRaw.role ? userRaw.role : "user" 
        this.cid = userRaw.cid 
    }
}