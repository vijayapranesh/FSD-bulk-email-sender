import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [emails, setEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

  const sendEmail = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('to', emails);
    formData.append('subject', subject);
    formData.append('text', message);
    formData.append('attachment', file);

    try {
      console.log(emails)
      const res = await axios.post('https://fsd-bulk-email-sender-1.onrender.com/send-email', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if(res.data.error){
        toast.error(res.data.error)
        
      }else{
        toast.success(res.data.message)
      }
      // toast.success(res.data.message)
      console.log(res.data);
    } catch (err) {
      toast.error(err);
    }
  };
 
  const handleSendEmail = () => {
    const emailList = emails.split(',').map(email => email.trim())
    console.log('EmailList :',emailList)
  }


  return (
    <>
    <div style={{border:'1px solid grey',borderRadius:'1em',backgroundColor:'#ADC1D0',padding:'3em 5em',margin:'0 10em'}}>
      <h3 style={{textAlign:'center'}}>Send Mail to Multiple Recipients</h3>
      <form onSubmit={sendEmail}>
        <input type="text" value={emails} onChange={e => setEmails(e.target.value)} placeholder="Recipient's email, "  />
        <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" required />
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" required />
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button onClick={handleSendEmail}>Send Email</button>
      </form>
    </div>
    <Toaster />
    </>
  );
}

export default App;
