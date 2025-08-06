import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI();
const imagePath = 'TODO_PATH_TO_IMAGE.JPG';
const base64Image = fs.readFileSync(imagePath, 'base64');

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    invokeHelloWorldEdgeFunction();
    getImages();
    getImageBanter();
  }, []);

  async function invokeHelloWorldEdgeFunction() {
    const { data, error } = await supabase.functions.invoke('hello-world', {
      body: { name: 'me' },
    });
    console.log("from hello world function:", data);
  }

  async function getImages() {
    const { data } = await supabase.from('images').select();
    console.log('data:', data);
    setImages(data);
  }

  async function getImageBanter(sendRequest = true) {
    if (!sendRequest) {
      console.log('aborted function to send image and prompt to OpenAI');
      return;
    }
    const response = await openai.responses.create({
      model: 'TODO_MODEL',
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: "what's in this image?" },
            { type: 'input_image', image_url: `data:image/jpeg;base64,${base64Image}` }, // passing a base64 encoded image
          ],
        },
      ],
    });
    console.log("from getImageBanter - response.output_text: ", response.output_text)
  }

  return (
    <>
      <h1>hello world 2 </h1>
      <ul>
        {images.map((image) => (
          <li key={image.narration_text}>{image.narration_text}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
