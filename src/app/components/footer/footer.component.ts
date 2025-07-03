import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent implements OnInit {
  
  currentYear: number = new Date().getFullYear();
  
  ngOnInit(): void {
    // Initialize any footer-specific logic here
  }
  
  /**
   * Handle social media link clicks for analytics
   */
  onSocialClick(platform: string): void {
    console.log(`Social media click: ${platform}`);
    // Add analytics tracking here if needed
  }
  
  /**
   * Handle newsletter subscription
   */
  onNewsletterClick(): void {
    console.log('Newsletter subscription clicked');
    // Add newsletter subscription logic here
  }

}
