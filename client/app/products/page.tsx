import {requireUser} from "@/lib/authHelper";



export default async function productsPage() {
    const user = await requireUser()
    console.log("user", user)

    if(user){
        return(
            <>
                <div>
                    <h1>hello you are authenticate </h1>
                </div>
            </>
        )
    }

}