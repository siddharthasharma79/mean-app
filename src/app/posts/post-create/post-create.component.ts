import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
// CLASS
export class PostCreateComponent implements OnInit {
  // PROPERTIES
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  private mode = 'create';
  private postId: string;

  // CONSTRUCTOR
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  // ON INIT
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  // SAVE POST
  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    // CREATE MODE
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      // EDIT MODE
      this.postsService.updatePost(
        this.postId,
        form.value.title,
        form.value.content
      );
    }
    form.resetForm();
  }
}
