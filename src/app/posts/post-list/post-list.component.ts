import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: 'First Post', content: 'This is first post content!' },
  //   { title: 'Second Post', content: 'This is second post content!' },
  //   { title: 'Third Post', content: 'This is third post content!' }
  // ];
  posts: Post[] = [];
  isLoading = false;
  expanded = false;
  private postsSub: Subscription;

  // CONSTRUCTOR
  constructor(public postsService: PostsService) {}

  // ON INIT
  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.isLoading = true;
    this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    //this.postsSub.unsubscribe();
  }
}
