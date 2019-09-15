import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { PageEvent } from '@angular/material';

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
  // PAGINATOR PROPERTIES
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  // CONSTRUCTOR
  constructor(public postsService: PostsService) {}

  // ON INIT
  ngOnInit() {
    console.log('NGONINIT CALLED');
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
  }

  // PAGE EVENT HANDLER
  onChangedPage(pageData: PageEvent) {
    console.log('ONCHANGEPAGE CALLED');
    this.isLoading = true;
    console.log('pageData', pageData);
    pageData.pageIndex = pageData.pageIndex + 1;
    this.currentPage = pageData.pageIndex;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    //this.postsSub.unsubscribe();
  }
}
