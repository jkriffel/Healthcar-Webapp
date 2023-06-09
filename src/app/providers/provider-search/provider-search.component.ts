import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ProviderSearchForm } from "../interfaces/provider-search-form.interface";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ProvidersService } from "../providers.service";
import { ProviderSearchInterface } from "../interfaces/provider-search-interface.interface";

@Component({
  selector: 'app-provider-search',
  templateUrl: './provider-search.component.html',
  styleUrls: ['./provider-search.component.scss']
})
export class ProviderSearchComponent {
  providerSearchForm = new FormGroup(<ProviderSearchForm>{
    age: new FormControl<number | null>(null, Validators.compose(
      [
        Validators.required,
        Validators.pattern('[0-9]{1,3}')
      ])),
    zipCode: new FormControl('', Validators.compose(
      [
        Validators.required,
        Validators.pattern('[0-9]{5}'),
        Validators.min(71500),
        Validators.max(73000)
      ])),
    hasHealthInsurance: new FormControl<boolean | null>(null, Validators.required)
  })

  isCollapsed = false;

  constructor(
    private snackBar: MatSnackBar,
    private providersService: ProvidersService) {
  }

  ngOnInit() {
    this.onChanges();
  }

  onChanges() {
    this.providerSearchForm.valueChanges.subscribe((formData) => {
      if (this.providerSearchForm.valid) {
        this.providersService.isSearchFormValid = this.providerSearchForm.valid;
        this.providersService.emailSearchResultsFormData = formData as ProviderSearchInterface;
      }
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: any; }; }) {
    if (this.isCollapsed && event.target.innerWidth > 900) {
      this.isCollapsed = false;
    }
  }

  onSearch(): void {
    if (this.providerSearchForm.valid) {
      if (window.innerWidth < 900) {
        this.isCollapsed = true;
      }
      this.providersService.updateHealthcareProviders(this.providerSearchForm.value as ProviderSearchInterface);
    } else {
      this.snackBar.open(ProvidersService.snackBarMessages.InvalidForm,
        ProvidersService.snackBarMessages.Close, {duration: 3000});
    }
  }
}

