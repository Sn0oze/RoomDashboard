import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { EngineComponent } from './engine/engine.component';
import { UiComponent } from './ui/ui.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatSelectModule,
  MatRippleModule,
  MatListModule
} from '@angular/material';
import { PipelineComponent } from './ui/pipeline/pipeline.component';
import { HorizontalListComponent } from './core/components/horizontal-list/horizontal-list.component';
import { VerticalListComponent } from './core/components/vertical-list/vertical-list.component';
import { VerticalListItemComponent } from './core/components/vertical-list/vertical-list-item/vertical-list-item.component';
import { StackItemComponent } from './core/components/vertical-list/stack-item/stack-item.component';
import { UiWidgetComponent } from './ui/ui-widget/ui-widget.component';
import { FloorComponent } from './ui/floor/floor.component';
import { FloorPlanComponent } from './ui/floor-plan/floor-plan.component';




@NgModule({
  declarations: [
    AppComponent,
    EngineComponent,
    UiComponent,
    PipelineComponent,
    HorizontalListComponent,
    VerticalListComponent,
    VerticalListItemComponent,
    StackItemComponent,
    UiWidgetComponent,
    FloorComponent,
    FloorPlanComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatSelectModule,
    MatRippleModule,
    MatListModule
  ],
  providers: [
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
