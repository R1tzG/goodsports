import React from "react";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"
import { app, db, storage, auth } from "../firebaseConfig.js";
import Router from "next/router.js";
import styles from '../styles/styles.module.css';
import { getFirestore, collection, setDoc, doc, getDocs } from "firebase/firestore";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

export default function Blogs() {
    const [blogs, setBlogs] = useState();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // retrieve firebase info
        async function retrieveData() {
            const blogs = await getDocs(collection(db, "Posts"));
            console.log("blogs")
            console.log(blogs);
            
            const blogsArray = [];

            
            
            blogs.forEach(async (blog) => {
                var id = blog.id;
                blog = blog.data();
                

                const processedMD = await remark()
                .use(remarkGfm)
                .use(html)
                .process(blog.content);
                
                const mdHTML = processedMD.toString();
                console.log(mdHTML + " " + id);
                
                blogsArray.push(
                    [blog.title, <div>
                        <div key={id} style = {{ "backgroundColor": "grey" }}>
                            <h2>{blog.title}</h2>
                            <div
                                className={styles.markdown}
                                dangerouslySetInnerHTML={{ __html: mdHTML }}
                            />
                        </div>
                        <br></br>
                        <br></br>
                    </div>]
                    
                );
            })
            console.log(blogs);

            setBlogs(blogsArray);
        }
        retrieveData();
    }, [])


    return (
        <>
            <input type="text" placeholder="Search" onChange = {(e) => setSearchTerm(e.target.value)}/>
            { blogs ? blogs.map((blog) => { 
                if (blog[0].includes(searchTerm)) {
                    return <div style = {{"display" : "block"}}>{blog[1]}</div>;
                }
                else {
                    return <div style = {{"display" : "none"}}>{blog[1]}</div>;
                }
                
            }) : <h1>Loading...</h1> }
        </>
    );
}