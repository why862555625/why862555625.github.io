var posts=["posts/d9795f88.html","posts/d9795d10.html","posts/d9795d89.html","posts/d9795d86.html","posts/ab232981.html","posts/667b4089.html","posts/7db00131.html","posts/d9795d88.html","posts/50daec4.html","posts/c9a941a3.html"];function toRandomPost(){pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);};