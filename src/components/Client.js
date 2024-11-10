import React, { useState } from "react";
import Avatar from "react-avatar"

const Client = ({username}) => {
      
    return ( 
        <div className="
            
            pt-5
            text-white
        ">
            <div className="flex flex-col ">
                <div>
                    <Avatar name={username} size={50} round='15px' />
                </div>
                <div className="text-sm pt-2 font-semibold">
                    {username}
                </div>
            </div>
            
             
        </div>
     );
}
 
export default Client;