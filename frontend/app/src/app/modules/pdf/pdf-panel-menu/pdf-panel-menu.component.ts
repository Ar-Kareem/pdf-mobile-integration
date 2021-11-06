import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { menuButtonPressed } from '@modules/auth/auth.reducer';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PanelMenu } from 'primeng/panelmenu';
import { environment } from 'src/environments/environment';
import { panelMenuCommands } from './pdf-panel-menu.const';

@Component({
  selector: 'app-pdf-panel-menu',
  templateUrl: './pdf-panel-menu.component.html',
  styleUrls: ['./pdf-panel-menu.component.scss']
})
export class PdfPanelMenuComponent implements OnInit, OnChanges {

  @Input() editMenuVisible: boolean = false;
  
  @Output() newMenuCommandEvent = new EventEmitter<string>();
  
  @ViewChild('panelMenu') panelMenu: PanelMenu|undefined;

  private topLevelMenus = {
    file: {
      label: 'File',
      icon: 'fa-solid fa-file-pdf',
      visiblee: true,
      expanded: false,
      items: [
        {label: 'View All Downloaded PDF', icon: 'fa-solid fa-folder-open', command: () => this.onClickPanelMenu(panelMenuCommands.allDownloadedPdf)},
        {label: 'Load PDF From URL', icon: 'fa-solid fa-link', command: () => this.onClickPanelMenu(panelMenuCommands.loadPdfUrl)},
        {label: 'Download New PDF From URL', icon: 'fa-solid fa-download', command: () => this.onClickPanelMenu(panelMenuCommands.downloadPdfUrl)},
      ]
    },
    edit: {
      label: 'Edit',
      icon: 'fa-solid fa-pencil',
      visiblee: false,
      expanded: false,
      items: [
          {label: 'Edit PDF Name', icon: 'fa-solid fa-file-signature', command: () => this.onClickPanelMenu(panelMenuCommands.setPdfName)},
          {label: 'Refresh', icon: 'pi pi-fw pi-refresh'},
      ]
    },
    help: {
      label: 'Help',
      icon: 'pi pi-fw pi-question',
      visiblee: true,
      expanded: false,
      items: [
          {
              label: 'Contents',
              icon: 'pi pi-pi pi-bars'
          },
          {
              label: 'Search', 
              icon: 'pi pi-pi pi-search', 
              items: [
                  {
                      label: 'Text', 
                      items: [
                          {
                              label: 'Workspace'
                          }
                      ]
                  },
                  {
                      label: 'User',
                      icon: 'pi pi-fw pi-file',
                  }
          ]}
      ]
    },
    actions: {
      label: 'Actions',
      icon: 'pi pi-fw pi-cog',
      visiblee: true,
      expanded: false,
      items: [
          {
              label: 'Edit',
              icon: 'pi pi-fw pi-pencil',
              items: [
                  {label: 'Save', icon: 'pi pi-fw pi-save'},
                  {label: 'Update', icon: 'pi pi-fw pi-save'},
              ]
          },
          {
              label: 'Other',
              icon: 'pi pi-fw pi-tags',
              items: [
                  {label: 'Delete', icon: 'pi pi-fw pi-minus'}
              ]
          }
      ]
    }
  }

  // passed to panelMenu
  items = this.getMenuObject();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,

  ) {}
  ngOnInit(): void {
    if (!environment.production) {
      (window as any)['PdfPanelMenuComponent'] = this;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
    if (changes.editMenuVisible) {
      this.topLevelMenus.edit.visiblee = changes.editMenuVisible.currentValue;
    }
    this.items = this.getMenuObject();
  }

  getMenuObject() {
    return Object.values(this.topLevelMenus).filter(v => v.visiblee);
  }

  onClickPanelMenu(event: string) {
    this.panelMenu?.collapseAll()
    this.newMenuCommandEvent.emit(event);
  }

}
