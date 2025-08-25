import React, { useEffect, useState } from 'react'

const useCheckView = (breakpoint=768) => {
    const[isMobile,setIsMobile]=useState(false)
    
    useEffect(()=>{
        const checkScreen=()=>{
            setIsMobile(window.innerWidth<breakpoint)
        }
        checkScreen()
        
        window.addEventListener('resize',checkScreen)

        return()=>window.removeEventListener('resize',checkScreen)

    },[breakpoint])
    return isMobile
  
}

export default useCheckView
