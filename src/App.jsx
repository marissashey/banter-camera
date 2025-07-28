import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    getImages();
  }, []);

  async function getImages() {
    const { data } = await supabase.from("images").select();
    console.log("data:", data);
    setImages(data);
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
