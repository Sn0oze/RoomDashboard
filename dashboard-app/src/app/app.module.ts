import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { EngineComponent } from './engine/engine.component';
import { UiComponent } from './ui/ui.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatSelectModule, MatRippleModule} from '@angular/material';
import { PipelineComponent } from './ui/pipeline/pipeline.component';
import { HorizontalListComponent } from './core/components/horizontal-list/horizontal-list.component';




@NgModule({
  declarations: [
    AppComponent,
    EngineComponent,
    UiComponent,
    PipelineComponent,
    HorizontalListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatSelectModule,
    MatRippleModule
  ],
  providers: [
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
