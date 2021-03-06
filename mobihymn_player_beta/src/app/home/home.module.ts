import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Ng5SliderModule } from 'ng5-slider';

import { HomeContPage } from './home.container';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng5SliderModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeContPage
      }
    ])
  ],
  declarations: [HomeContPage, HomePage]
})
export class HomePageModule {}
