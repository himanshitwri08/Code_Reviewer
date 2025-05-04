import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css" // PrismJS theme for syntax highlighting
import Editor from "react-simple-code-editor" // Code editor component
import prism from "prismjs" // Library used for syntax highlighting
import Markdown from "react-markdown" // For rendering markdown in the review output
import rehypeHighlight from "rehype-highlight" // Highlight plugin for markdown rendering
import axios from 'axios' // For sending requests to the backend
import './App.css' 

function App() {
  const [code, setCode] = useState(`function sum() { 
  return 1 + 1
}`)  //Initial code 

  const [review, setReview] = useState('')
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    setClicked(true) // Add the clicked effect
    setTimeout(() => setClicked(false), 150) // Remove after 150ms

    const response = await axios.post('http://localhost:3000/ai/get-review', { code })
    setReview(response.data)
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "0.7rem",
                height: "100%",
                width: "100%",
                backgroundColor: "#2d2d2d",
                color: "#f8f8f2",
                overflow: "auto"
              }}
            />
          </div>
          <div
            onClick={reviewCode}
            className={`review ${clicked ? 'clicked' : ''}`}> 
            Review
          </div>
        </div>
        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}> 
            {review}
          </Markdown>
        </div>
      </main>
    </>
  )
}

export default App
