export default function Home() {
  
        fetch('http://localhost:3001/usuario/login', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`}
          })
  
  return (
    <div>


    </div>
  );
}
