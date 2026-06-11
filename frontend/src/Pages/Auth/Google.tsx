function Google() {
    return ( 
        <button
  onClick={() =>{
    console.log("clik")
     window.location.href = "http://localhost:3000/api/auth/google"
  }
  }
>
  Continuer avec Google
</button>
     );
}

export default Google;