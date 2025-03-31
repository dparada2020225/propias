import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SppmTableComponent} from './psm-table.component';
import {AdfFormatService} from "@adf/components";
import {MockTranslatePipe} from "../../../../../../assets/mocks/public/tranlatePipeMock";
import {environment} from "../../../../../../environments/environment";

describe('SppmTableComponent', () => {
  let component: SppmTableComponent;
  let fixture: ComponentFixture<SppmTableComponent>;
  let adfFormat: jasmine.SpyObj<AdfFormatService>;


  beforeEach(async () => {

    const adfFormatSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount'])


    await TestBed.configureTestingModule({
      declarations: [ SppmTableComponent, MockTranslatePipe ],
      providers: [
        { provide: AdfFormatService, useValue: adfFormatSpy },
      ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(SppmTableComponent);
    component = fixture.componentInstance;
    adfFormat = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change isChecked property of a register and update registerListSelected', () => {
    // Arrange
    component.registers = [
      { accountNumber: '123', isChecked: false },
      { accountNumber: '456', isChecked: false }
    ];

    // Act
    component.onCheckChange(true, { accountNumber: '123' });

    // Assert
    expect(component.registers[0].isChecked).toBe(true);
    expect(component.registerListSelected.length).toBe(1);
    expect(component.registerListSelected[0].accountNumber).toBe('123');
  });

  it('should delete selected registers and emit the updated list', () => {
    // Arrange
    component.registers = [
      { accountNumber: '123', isChecked: true },
      { accountNumber: '456', isChecked: false }
    ];
    component.registerListSelected = [
      { accountNumber: '123', isChecked: true }
    ] as any;
    spyOn(component.onLoadListItems, 'emit');

    // Act
    component.deleteRegisters();

    // Assert
    expect(component.registers.length).toBe(1);
    expect(component.registerListSelected.length).toBe(0);
    expect(component.onLoadListItems.emit).toHaveBeenCalledWith([{ accountNumber: '456', isChecked: false }]);
  });

  it('should return tableHeaders without first element if isSelectedEnabled is false', () => {
    // Arrange
    component.isSelectedEnabled = false;
    component.tableHeaders = ['header1', 'header2', 'header3'] as any;

    // Act
    const result = component.tableHeaderList;

    // Assert
    expect(result).toEqual(['header2', 'header3'] as any);
  });

  it('should return tableHeaders if isSelectedEnabled is true', () => {
    // Arrange
    component.isSelectedEnabled = true;
    component.tableHeaders = ['header1', 'header2', 'header3'] as any;

    // Act
    const result = component.tableHeaderList;

    // Assert
    expect(result).toEqual(['header1', 'header2', 'header3'] as any);
  });

  it('should return "full-grid" if isSelectedEnabled is true', () => {
    // Arrange
    component.isSelectedEnabled = true;

    // Act
    const result = component.gridClassName;

    // Assert
    expect(result).toBe('full-grid');
  });

  it('should return "default-grid" if isSelectedEnabled is false', () => {
    // Arrange
    component.isSelectedEnabled = false;

    // Act
    const result = component.gridClassName;

    // Assert
    expect(result).toBe('default-grid');
  });

  it('should get currency', () => {
    const result = component.currency;
    expect(result).toEqual(environment.currency);
  })


});
