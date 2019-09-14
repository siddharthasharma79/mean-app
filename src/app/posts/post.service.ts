import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { identifierModuleUrl } from '@angular/compiler';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })

// POST SERVICE CALSS
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  // CONSTRUCTOR
  constructor(private http: HttpClient, private router: Router) {}

  // GET ALL POSTS
  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  // POST UPDATE LISTENER
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  // GET SINGLE POST
  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  // ADD POST
  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    console.log('Sending Post Data:', post);
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe(responseData => {
        console.log(
          'added post with response:',
          responseData.message + 'with id: ' + responseData.postId
        );
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        alert('Post Added Successfully');
        this.router.navigate(['/']);
      });
  }

  // EDIT POST
  updatePost(id: string, title: string, content: string) {
    const post = { id: id, title: title, content: content };
    this.http
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response => {
        console.log('Edit Response: ', response);
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        alert('Post Updated Successfully');
        this.router.navigate(['/']);
      });
  }

  // DELETE POST
  deletePost(postId: string) {
    console.log('Calling delete post with ID : ', postId);
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  } // DELETE POST END
} // POST SERVICE CLASS END
