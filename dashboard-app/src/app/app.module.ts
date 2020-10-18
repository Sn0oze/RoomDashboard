import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { EngineComponent } from './engine/engine.component';
import { UiComponent } from './ui/ui.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PipelineComponent } from './ui/floor/pipeline/pipeline.component';
import { HorizontalListComponent } from './core/components/horizontal-list/horizontal-list.component';
import { UiWidgetComponent } from './ui/ui-widget/ui-widget.component';
import { FloorComponent } from './ui/floor/floor.component';
import { FloorPlanComponent } from './ui/floor/floor-plan/floor-plan.component';
import {MatSelectModule} from '@angular/material/select';
import {MatRippleModule} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { FontLegibilityPipe } from './core/pipes/font-legibility.pipe';
import { MatSliderModule } from '@angular/material/slider';




@NgModule({
  declarations: [
    AppComponent,
    EngineComponent,
    UiComponent,
    PipelineComponent,
    HorizontalListComponent,
    UiWidgetComponent,
    FloorComponent,
    FloorPlanComponent,
    FontLegibilityPipe
  ],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      MatSelectModule,
      MatRippleModule,
      MatListModule,
      MatIconModule,
      MatSliderModule
    ],
  providers: [
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
