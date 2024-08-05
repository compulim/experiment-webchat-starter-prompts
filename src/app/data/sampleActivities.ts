export default [
  {
    from: { role: 'bot' },
    suggestedActions: {
      to: {},
      actions: [
        {
          image:
            'data:image/svg+xml;utf8,<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 4.5C2 4.22386 2.22386 4 2.5 4H13.5C13.7761 4 14 4.22386 14 4.5C14 4.77614 13.7761 5 13.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM2 9.5C2 9.22386 2.22386 9 2.5 9H17.5C17.7761 9 18 9.22386 18 9.5C18 9.77614 17.7761 10 17.5 10H2.5C2.22386 10 2 9.77614 2 9.5ZM2.5 14C2.22386 14 2 14.2239 2 14.5C2 14.7761 2.22386 15 2.5 15H11.5C11.7761 15 12 14.7761 12 14.5C12 14.2239 11.7761 14 11.5 14H2.5Z" fill="%23707070"/></svg>',
          text: 'Review key points in [file](#)',
          type: 'messageBack',
          title: 'Summarize'
        },
        {
          image:
            'data:image/svg+xml;utf8,<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.1813 2.92689C16.0291 1.71505 14.1047 1.69077 12.9222 2.87317L3.54741 12.2475C3.21958 12.5754 2.99204 12.9899 2.89148 13.4424L2.01387 17.3923C1.97678 17.5592 2.02754 17.7335 2.14844 17.8544C2.26934 17.9753 2.44362 18.026 2.6105 17.9889L6.53689 17.1157C7.00432 17.0118 7.43243 16.7767 7.77103 16.4381L17.129 7.08003C18.27 5.939 18.2933 4.09631 17.1813 2.92689ZM13.6293 3.58029C14.4143 2.79538 15.6917 2.8115 16.4566 3.61596C17.1948 4.39225 17.1793 5.61548 16.4219 6.37293L15.7507 7.04418L12.958 4.25155L13.6293 3.58029ZM12.2509 4.95864L15.0436 7.7513L7.06391 15.731C6.85976 15.9352 6.60164 16.0769 6.31982 16.1396L3.1605 16.8421L3.86768 13.6593C3.92698 13.3924 4.06117 13.148 4.2545 12.9547L12.2509 4.95864Z" fill="%23707070"/></svg>',
          text: 'Write more about...',
          type: 'messageBack',
          title: 'Create'
        },
        {
          image:
            'data:image/svg+xml;utf8,<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.49279 4.90114C8.13479 4.9711 7.7439 5.20337 7.43474 5.74712C7.29826 5.98718 6.99301 6.07114 6.75296 5.93465C6.5129 5.79817 6.42894 5.49292 6.56543 5.25287C7.00628 4.47749 7.63328 4.0502 8.30099 3.9197C8.9539 3.7921 9.60295 3.95667 10.0932 4.28126C10.5768 4.6015 10.9679 5.12423 10.9804 5.75187C10.9934 6.40602 10.5946 6.99672 9.86123 7.43036C9.36263 7.7252 9.16869 7.92513 9.08626 8.05795C9.01687 8.16975 9.00009 8.27172 9.00009 8.5C9.00009 8.77614 8.77623 9 8.50009 9C8.22394 9 8.00009 8.77614 8.00009 8.5C8.00009 8.22827 8.01399 7.88929 8.2366 7.53061C8.44617 7.19295 8.80555 6.89287 9.35222 6.5696C9.88718 6.25326 9.98416 5.95168 9.98059 5.77173C9.97649 5.56527 9.83866 5.31208 9.54108 5.11505C9.25005 4.92235 8.86559 4.82828 8.49279 4.90114ZM8.75 11.5C9.16421 11.5 9.5 11.1642 9.5 10.75C9.5 10.3358 9.16421 10 8.75 10C8.33579 10 8 10.3358 8 10.75C8 11.1642 8.33579 11.5 8.75 11.5ZM8.50019 1C4.91034 1 2.00019 3.91015 2.00019 7.5C2.00019 8.651 2.29978 9.73335 2.82544 10.6719L2.0297 12.7542C1.73642 13.5216 2.4424 14.2957 3.23352 14.0741L5.7209 13.3774C6.5641 13.7768 7.50671 14 8.50019 14C12.09 14 15.0002 11.0899 15.0002 7.5C15.0002 3.91015 12.09 1 8.50019 1ZM3.00019 7.5C3.00019 4.46243 5.46263 2 8.50019 2C11.5378 2 14.0002 4.46243 14.0002 7.5C14.0002 10.5376 11.5378 13 8.50019 13C7.59806 13 6.74803 12.7832 5.99798 12.3993L5.82377 12.3101L2.96381 13.1111L3.93292 10.5753L3.80463 10.3655C3.29438 9.53135 3.00019 8.55079 3.00019 7.5ZM11.4628 17C9.49315 17 7.72814 16.1239 6.53613 14.7402C7.09918 14.8926 7.68851 14.981 8.29584 14.9973C9.19123 15.629 10.2837 16 11.4628 16C12.3649 16 13.2149 15.7832 13.965 15.3993L14.1392 15.3101L16.9992 16.1111L16.0301 13.5752L16.1583 13.3655C16.6686 12.5313 16.9628 11.5508 16.9628 10.5C16.9628 9.34552 16.6071 8.27414 15.9993 7.38943C15.9905 6.78165 15.9095 6.19137 15.7643 5.6268C17.1125 6.81779 17.9628 8.5596 17.9628 10.5C17.9628 11.651 17.6632 12.7333 17.1375 13.6719L17.9333 15.7542C18.2266 16.5216 17.5206 17.2957 16.7295 17.0741L14.2421 16.3774C13.3989 16.7768 12.4563 17 11.4628 17Z" fill="%23707070"/></svg>',
          text: 'Who is [person](#)',
          type: 'messageBack',
          title: 'Ask'
        }
      ]
    },
    text: 'Ready to explore? Select one of the suggestions below to get started...\n\nYou can always use the prompt guide for suggestions by selecting this button',
    textFormat: 'markdown',
    type: 'message'
  }
];
