import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutContPage } from './about.container';
import { AboutPage } from './about.page';

@NgModule({
  declarations: [AboutPage, AboutContPage],
  imports: [
    CommonModule
  ]
})
export class AboutModule { }
