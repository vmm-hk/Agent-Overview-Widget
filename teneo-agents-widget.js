(function() {
    'use strict';
    
    // Widget configuration
    const WIDGET_CONFIG = {
        apiUrl: 'https://backend.developer.chatroom.teneo-protocol.ai/api/public/agents',
        containerId: 'teneo-agents-widget',
        detailContainerId: 'teneo-agent-detail',
        maxAgents: 12,
        showSearch: true,
        showPopularSection: true,
        adminApiUrl: null,
        popularAgentIds: [
            'x-followers-followings-1',
            'instagram',
            'linkedin-agent',
            'x-agent-enterprise-v2',
            'messaribtceth',
            'vc-attention'
        ],
        detailPageUrl: '/agent-detail',
        explorerUrls: {
            peaq: 'https://peaq.subscan.io',
            base: 'https://basescan.org',
            avalanche: 'https://snowtrace.io',
            bsc: 'https://bscscan.com'
        }
    };

    // CSS styles matching exact Figma specifications
    const widgetCSS = `
        .teneo-widget-container {
            font-family: 'PPNeueMontreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: #ffffff;
            background: #09090a;
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
            overflow-x: auto;
        }

        /* Category Filter Row (Frame) */
        .teneo-widget-category-row {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            gap: 12px;
            width: 100%;
            max-width: 1326px; /* allow more width so categories stay within two rows on large screens */
            min-height: 92px; /* single-row spec, but allow wrapping */
            margin: 0 auto 24px auto; /* center whole row and add space above search */
            box-sizing: border-box;
        }

        /* "All Categories" dropdown */
        .teneo-widget-category-dropdown {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            gap: 12px;
            min-width: 107px;
            height: 16px;
            padding: 0;
            background: transparent;
            border: none;
            color: #E5E7EB;
            font-family: 'PPNeueMontreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px;
            line-height: 16px;
            cursor: pointer;
        }

        .teneo-widget-category-dropdown-icon {
            width: 10px;
            height: 6px;
            background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23E5E7EB' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: center;
        }

        .teneo-widget-category-dropdown-label {
            white-space: nowrap;
        }

        .teneo-widget-category-dropdown.active {
            color: #FFFFFF;
        }

        .teneo-widget-category-pill-container {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center; /* center pills so rows form a pyramid */
            gap: 10px;
            flex: 1;
        }

        /* Single Category Box - matches Load More button styling */
        .teneo-widget-category-pill {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            min-width: 74px;
            height: 40px;
            padding: 0 12px;
            border-radius: 0px;
            border: none;
            background: #25272B;
            color: #FAFCFC;
            font-family: 'PPNeueMontreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px;
            line-height: 1.4;
            cursor: pointer;
            white-space: nowrap;
            transition: background 0.15s ease, color 0.15s ease;
        }

        .teneo-widget-category-pill:hover {
            background: #2d3135; /* same hover as load more */
        }

        .teneo-widget-category-pill.active {
            background: #D3F372;
            color: #000000;
        }

        .teneo-widget-search-row {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 12px;
            gap: 8px;
            width: 100%;
            max-width: 1045px;
            height: 50px;
            background: #25272B;
            margin: 0 auto 2rem auto;
        }

        .teneo-widget-search-frame {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0px;
            gap: 12px;
            width: 100%;
            height: 26px;
        }

        .teneo-widget-search-icon {
            width: 18px;
            height: 18px;
            flex: none;
            background: transparent;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18.75 18.75L14.4 14.4M8.75 3.75C11.5114 3.75 13.75 5.98858 13.75 8.75M16.75 8.75C16.75 13.1683 13.1683 16.75 8.75 16.75C4.33172 16.75 0.75 13.1683 0.75 8.75C0.75 4.33172 4.33172 0.75 8.75 0.75C13.1683 0.75 16.75 4.33172 16.75 8.75Z' stroke='%239EB5BC' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }

        .teneo-widget-search-input {
            width: 100%;
            height: 26px;
            font-family: 'PPNeueMontreal', sans-serif;
            font-style: normal;
            font-weight: 400;
            font-size: 20px;
            line-height: 26px;
            color: #FAFCFC;
            background: transparent;
            border: none;
            outline: none;
            flex: 1;
        }

        .teneo-widget-search-input::placeholder {
            color: #FAFCFC;
            opacity: 0.7;
        }

        .teneo-widget-section {
            margin-bottom: 4rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .teneo-widget-section-title {
            width: auto;
            max-width: 100%;
            height: 115px;
            font-family: 'PPNeueMontreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-weight: 400;
            font-style: normal;
            font-size: 3rem;
            line-height: 1.2;
            letter-spacing: 0;
            text-align: center;
            color: #FFFFFF;
            background: transparent;
            opacity: 1;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            overflow: visible;
        }

        /* Grid Container - Frame 1261156334 */
        .teneo-widget-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 26px;
            width: 100%;
            max-width: 1326px;
            height: auto;
            justify-content: center;
            align-items: stretch;
            margin: 0 auto;
            box-sizing: border-box;
        }

        /* Agent Card - Frame 1261156182 */
        .teneo-widget-card {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding: 28.4322px;
            gap: 11.85px;
            width: 100%;
            background: #25272B;
            flex: none;
            flex-grow: 0;
            border-radius: 0px;
            border: 1px solid #1a1a1a;
            box-sizing: border-box;
        }

        .teneo-widget-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        /* Card Content Container - Frame 1261156189 */
        .teneo-widget-card-content {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            padding: 0px;
            gap: 20.14px;
            width: 100%;
            flex: 1;
            align-self: stretch;
            min-height: 0;
        }

        /* Top Section - Frame 1261156188 */
        .teneo-widget-card-top {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 0px;
            gap: 17.77px;
            width: 100%;
            flex: 1;
            align-self: stretch;
            min-height: 0;
        }

        /* Header Row - Frame 1261156308 */
        .teneo-widget-header-card {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            padding: 0px;
            gap: 12px;
            width: 100%;
            flex: none;
            align-self: stretch;
            flex-grow: 0;
        }

        /* Avatar Section - Frame 1261156187 */
        .teneo-widget-avatar-section {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            padding: 0px;
            gap: 10.66px;
            flex: 1;
            min-width: 0;
        }

        /* Avatar Circle - Group 1000003593 */
        .teneo-widget-avatar {
            width: 49.76px;
            height: 50.04px;
            flex: none;
            flex-grow: 0;
            position: relative;
        }

        .teneo-widget-avatar img {
            position: absolute;
            width: 49.76px;
            height: 49.76px;
            left: 0px;
            top: 0.28px;
            border-radius: 50%;
            object-fit: cover;
            background: #FFFFFF;
        }

        /* Ellipse 640 */
        .teneo-widget-initials {
            position: absolute;
            width: 49.76px;
            height: 49.76px;
            left: 0px;
            top: 0.28px;
            background: #FFFFFF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* X - Agent Initial */
        .teneo-widget-initials-text {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            font-family: 'PPNeueMontreal', sans-serif;
            font-style: normal;
            font-weight: 500;
            font-size: 26px;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #000000;
        }

        /* Agent Info - Frame 1261156186 */
        .teneo-widget-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 0px;
            gap: 4px;
            flex: 1;
            min-width: 0;
            height: auto;
        }

        /* Agent Name Container - Frame 1261156183 */
        .teneo-widget-name-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 0px;
            margin: 0px;
            width: 100%;
            flex: none;
            flex-grow: 0;
        }

        /* Agent X */
        .teneo-widget-name {
            width: 100%;
            font-family: 'PPNeueMontreal', sans-serif;
            font-style: normal;
            font-weight: 500;
            font-size: 20px;
            line-height: 1.3;
            color: #BAD3D8;
            flex: none;
            flex-grow: 0;
            padding: 0px;
            margin: 0px;
        }

        /* Creator Container - Frame 1261156184 */
        .teneo-widget-creator-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 0px;
            margin: 0px;
            margin-top: 0px;
            width: 100%;
            height: 18.95481300354004px;
            flex: none;
            align-self: stretch;
            flex-grow: 0;
        }

        /* frolody-007-ai */
        .teneo-widget-creator {
            width: 100%;
            height: 18.95481300354004px;
            font-family: 'PPNeueMontreal', sans-serif;
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 180%;
            display: flex;
            align-items: center;
            color: #BAD3D8;
            flex: none;
            flex-grow: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 0px;
            margin: 0px;
        }

        /* Status Container - Frame 1261156309 */
        .teneo-widget-status-text {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0px;
            gap: 7.11px;
            height: 25px;
            flex: none;
            flex-grow: 0;
        }

        .teneo-widget-status-text.online {
            width: auto;
        }

        .teneo-widget-status-text.offline {
            width: auto;
        }

        /* Ellipse 674 - Status Dot */
        .teneo-widget-status-dot {
            width: 16.59px;
            height: 16.59px;
            border-radius: 50%;
            flex: none;
            flex-grow: 0;
        }

        .teneo-widget-status-text.online .teneo-widget-status-dot {
            background: #D3F372;
        }

        .teneo-widget-status-text.offline .teneo-widget-status-dot {
            background: #797E80;
        }

        /* Online/Offline Text */
        .teneo-widget-status-label {
            height: 25px;
            font-family: 'PPNeueMontreal', sans-serif;
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 180%;
            display: flex;
            align-items: center;
            color: #BAD3D8;
            flex: none;
            flex-grow: 0;
        }

        .teneo-widget-status-text.online .teneo-widget-status-label {
            width: auto;
        }

        .teneo-widget-status-text.offline .teneo-widget-status-label {
            width: auto;
        }

        /* Card Category Boxes - per Figma specs */
        .teneo-widget-card-categories {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 6px;
            width: 100%;
            height: 40px;
            flex: none;
            flex-grow: 0;
            overflow: hidden;
        }

        .teneo-widget-card-category-pill {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            height: 40px;
            padding: 0 12px;
            border-radius: 0px;
            border: none;
            background: #000000;
            color: #D3F372;
            font-family: 'PPNeueMontreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-weight: 400;
            font-size: 16px;
            line-height: 16px;
            letter-spacing: 0%;
            white-space: nowrap;
            flex: none;
            flex-grow: 0;
        }

        /* Description */
        .teneo-widget-description {
            width: 100%;
            min-height: 0;
            flex: none;
            font-family: 'PPNeueMontreal', sans-serif;
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 150%;
            display: flex;
            align-items: flex-start;
            color: #BAD3D8;
            align-self: stretch;
            overflow: hidden;
        }

        .teneo-widget-description p {
            margin: 0;
            width: 100%;
            display: -webkit-box;
            -webkit-line-clamp: 5;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .teneo-widget-card-has-categories .teneo-widget-description p {
            -webkit-line-clamp: 4;
        }

        /* Button Container - Group 1000003594 */
        .teneo-widget-actions {
            width: 98.33px;
            height: 28.43px;
            flex: none;
            flex-grow: 0;
            position: relative;
        }

        /* Rectangle 5074 */
        .teneo-widget-btn {
            position: absolute;
            width: 98.33px;
            height: 28.43px;
            left: 0px;
            top: 0px;
            background: #D3F372;
            border: none;
            border-radius: 0px;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .teneo-widget-btn:hover {
            background: #c5e054;
            transform: translateY(-1px);
        }

        /* Chat Now Text */
        .teneo-widget-btn .btn-text {
            position: absolute;
            width: 98.33px;
            height: 26px;
            left: 0px;
            top: 1.21px;
            font-family: 'PPNeueMontreal', sans-serif;
            font-style: normal;
            font-weight: 400;
            font-size: 14.2161px;
            line-height: 180%;
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: center;
            color: #000000;
        }

        .teneo-widget-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem;
            gap: 1rem;
        }

        .teneo-widget-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #374151;
            border-top: 3px solid #6366f1;
            border-radius: 50%;
            animation: teneo-widget-spin 1s linear infinite;
        }

        @keyframes teneo-widget-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .teneo-widget-error {
            text-align: center;
            padding: 2rem;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 12px;
            color: #fca5a5;
        }

        .teneo-widget-load-more {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            padding: 0px;
            gap: 15.4px;
            width: 100%;
            max-width: 385px;
            height: 59.23379135131836px;
            margin: 0 auto;
            margin-top: 2rem;
            opacity: 1;
            box-sizing: border-box;
        }

        .teneo-widget-load-more-btn {
            padding: 0px;
            background: #25272B;
            border: none;
            border-radius: 0px;
            color: #FAFCFC;
            font-weight: 400;
            font-size: 18.9548px;
            line-height: 19px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: 'PPNeueMontreal', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            max-width: 385px;
            height: 59.23379135131836px;
            gap: 9.48px;
        }

        .teneo-widget-load-more-btn:hover {
            background: #2d3135;
        }

        /* Responsive */
        @media (max-width: 1400px) {
            .teneo-widget-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 900px) {
            .teneo-widget-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .teneo-widget-container {
                padding: 0 20px;
            }

            .teneo-widget-category-row {
                max-width: 100%;
                flex-direction: column;
                align-items: flex-start;
                min-height: auto;
                gap: 12px;
            }

            .teneo-widget-category-pill-container {
                justify-content: flex-start;
                width: 100%;
            }

            .teneo-widget-category-pill {
                min-width: auto;
            }

            .teneo-widget-section-title {
                width: 100%;
                min-width: auto;
                max-width: 100%;
                font-size: 2.5rem;
                line-height: 1.2;
                padding: 0 20px;
                box-sizing: border-box;
            }

            .teneo-widget-search-row {
                margin-left: 0;
                margin-right: 0;
                padding: 12px;
            }
        }

        @media (max-width: 468px) {
            .teneo-widget-grid {
                grid-template-columns: 1fr;
                padding: 0;
            }

            .teneo-widget-section-title {
                font-size: 2rem;
                line-height: 1.2;
                padding: 0 15px;
            }
        }

        /* Manage Agent Pop-Up */
        .teneo-manage-popup {
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 64px 201px;
            gap: 82px;
            isolation: isolate;
            position: fixed;
            width: 1728px;
            max-width: 95vw;
            max-height: 90vh;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: #050506;
            border: 1px solid #222222;
            z-index: 10000;
            overflow-y: auto;
        }

        /* Frame 1261156265 - Top Bar */
        .teneo-manage-popup-topbar {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0px;
            gap: 36px;
            width: 1326px;
            max-width: 100%;
            height: 50px;
            flex: none;
            order: 0;
            align-self: stretch;
            flex-grow: 0;
            z-index: 0;
        }

        /* Search Row */
        .teneo-manage-popup-search-row {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 12px;
            gap: 8px;
            width: 1045px;
            height: 50px;
            background: #25272B;
            flex: none;
            order: 0;
            flex-grow: 0;
        }

        /* Search Frame */
        .teneo-manage-popup-search-frame {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0px;
            gap: 12px;
            width: 1021px;
            height: 18px;
            flex: none;
            order: 0;
            align-self: stretch;
            flex-grow: 0;
        }

        /* Search Icon */
        .teneo-manage-popup-search-icon {
            width: 18px;
            height: 18px;
            flex: none;
            order: 0;
            flex-grow: 0;
            background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18.75 18.75L14.4 14.4M8.75 3.75C11.5114 3.75 13.75 5.98858 13.75 8.75M16.75 8.75C16.75 13.1683 13.1683 16.75 8.75 16.75C4.33172 16.75 0.75 13.1683 0.75 8.75C0.75 4.33172 4.33172 0.75 8.75 0.75C13.1683 0.75 16.75 4.33172 16.75 8.75Z' stroke='%239EB5BC' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }

        /* Search Input */
        .teneo-manage-popup-search-input {
            width: 135px;
            height: 16px;
            font-family: 'PPNeueMontreal', sans-serif;
            font-style: normal;
            font-weight: 400;
            font-size: 20px;
            line-height: 16px;
            color: #FAFCFC;
            background: transparent;
            border: none;
            outline: none;
            flex: 1;
            order: 1;
            flex-grow: 0;
        }

        .teneo-manage-popup-search-input::placeholder {
            color: #FAFCFC;
            opacity: 0.7;
        }

        /* Filter Button Frame */
        .teneo-manage-popup-filter-frame {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0px;
            gap: 13px;
            width: 244px;
            height: 50px;
            flex: none;
            order: 1;
            flex-grow: 0;
        }

        /* Filter Row */
        .teneo-manage-popup-filter-row {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 12px;
            gap: 8px;
            width: 244px;
            height: 50px;
            background: #1D2B63;
            border-radius: 5px;
            flex: none;
            order: 0;
            flex-grow: 0;
            cursor: pointer;
            border: none;
        }

        /* Filter Frame */
        .teneo-manage-popup-filter-frame-inner {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0px;
            gap: 12px;
            width: 72px;
            height: 16px;
            flex: none;
            order: 0;
            flex-grow: 0;
        }

        /* Filter Icon */
        .teneo-manage-popup-filter-icon {
            width: 18px;
            height: 14px;
            border: 1px solid #FFFFFF;
            flex: none;
            order: 0;
            flex-grow: 0;
        }

        /* Filter Label */
        .teneo-manage-popup-filter-label {
            width: 42px;
            height: 16px;
            font-family: 'PPNeueMontreal', sans-serif;
            font-style: normal;
            font-weight: 400;
            font-size: 20px;
            line-height: 16px;
            color: #FAFCFC;
            flex: none;
            order: 1;
            flex-grow: 0;
        }

        /* Section Title Frame */
        .teneo-manage-popup-title-frame {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0px;
            gap: 176px;
            width: 409px;
            height: 43px;
            flex: none;
            order: 1;
            flex-grow: 0;
            z-index: 1;
        }

        /* Popular Agents Title */
        .teneo-manage-popup-title {
            width: 409px;
            height: 115px;
            font-family: 'PPNeueMontreal', sans-serif;
            font-style: normal;
            font-weight: 400;
            font-size: 3rem;
            line-height: 1.2;
            text-align: center;
            color: #FFFFFF;
            flex: none;
            order: 0;
            flex-grow: 0;
        }

        /* Section Container */
        .teneo-manage-popup-section {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 0px;
            gap: 36px;
            width: 1326px;
            max-width: 100%;
            height: auto;
            flex: none;
            order: 2;
            align-self: stretch;
            flex-grow: 0;
            z-index: 2;
        }

        /* Grid Row */
        .teneo-manage-popup-grid-row {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0px;
            gap: 26px;
            width: 1326px;
            max-width: 100%;
            height: auto;
            flex: none;
            order: 0;
            align-self: stretch;
            flex-grow: 0;
            flex-wrap: wrap;
        }

        /* More Agents Title Frame */
        .teneo-manage-popup-more-title-frame {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0px;
            gap: 176px;
            width: 345px;
            height: 43px;
            flex: none;
            order: 3;
            flex-grow: 0;
            z-index: 3;
        }

        /* More Agents Title */
        .teneo-manage-popup-more-title {
            width: 345px;
            height: 115px;
            font-family: 'PPNeueMontreal', sans-serif;
            font-style: normal;
            font-weight: 400;
            font-size: 3rem;
            line-height: 1.2;
            text-align: center;
            color: #FFFFFF;
            flex: none;
            order: 0;
            flex-grow: 0;
        }

        /* Load More Frame */
        .teneo-manage-popup-load-more-frame {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            padding: 0px;
            gap: 15.4px;
            width: 385.0196533203125px;
            height: 59.23379135131836px;
            background: #25272B;
            flex: none;
            order: 5;
            flex-grow: 0;
            z-index: 5;
            opacity: 1;
            box-sizing: border-box;
            margin: 0 auto;
        }

        /* Load More Row */
        .teneo-manage-popup-load-more-row {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 14.2161px;
            gap: 9.48px;
            width: 137.42px;
            height: 59.23px;
            background: #25272B;
            border-radius: 0px;
            flex: none;
            order: 0;
            flex-grow: 0;
            cursor: pointer;
            border: none;
            transition: all 0.2s ease;
        }

        .teneo-manage-popup-load-more-row:hover {
            background: #2d3135;
        }

        /* Load More Frame Inner */
        .teneo-manage-popup-load-more-frame-inner {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0px;
            gap: 14.22px;
            width: 86px;
            height: 19px;
            flex: none;
            order: 0;
            flex-grow: 0;
        }

        /* Load More Text */
        .teneo-manage-popup-load-more-text {
            width: 86px;
            height: 19px;
            font-family: 'PPNeueMontreal', sans-serif;
            font-style: normal;
            font-weight: 400;
            font-size: 18.9548px;
            line-height: 19px;
            color: #FAFCFC;
            flex: none;
            order: 0;
            flex-grow: 0;
        }

        /* Popup Backdrop */
        .teneo-manage-popup-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            display: none;
            align-items: center;
            justify-content: center;
        }

        .teneo-manage-popup-backdrop.active {
            display: flex;
        }

        @media (max-width: 1800px) {
            .teneo-manage-popup {
                width: 95vw;
                padding: 40px 20px;
            }
            
            .teneo-manage-popup-topbar {
                width: 100%;
            }
            
            .teneo-manage-popup-section {
                width: 100%;
            }
            
            .teneo-manage-popup-grid-row {
                width: 100%;
            }
        }

        @media (max-width: 768px) {
            .teneo-manage-popup {
                padding: 32px 16px;
                gap: 40px;
            }
            
            .teneo-manage-popup-topbar {
                flex-direction: column;
                height: auto;
                gap: 16px;
            }
            
            .teneo-manage-popup-search-row {
                width: 100%;
            }
            
            .teneo-manage-popup-filter-frame {
                width: 100%;
            }
            
            .teneo-manage-popup-title {
                font-size: 2.5rem;
                line-height: 1.2;
            }
            
            .teneo-manage-popup-more-title {
                font-size: 2.5rem;
                line-height: 1.2;
            }
        }
    `;

    // Explorer chain colors (from Figma)
    const CHAIN_COLORS = {
        peaq: '#6666fd',
        base: '#0101fe',
        avalanche: '#ea4242',
        bsc: '#f0b90b'
    };

    // CSS for agent detail page (extracted from Figma via Pen.dev)
    const detailCSS = `
/* ===== TENEO DETAIL PAGE ===== */
#teneo-agent-detail *,
#teneo-agent-detail *::before,
#teneo-agent-detail *::after {
  box-sizing: border-box;
}
#teneo-agent-detail {
  font-family: 'PPNeueMontreal', 'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #BAD3D8;
  background: #09090a;
  -webkit-font-smoothing: antialiased;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  position: relative;
}
.teneo-detail-grid-lines {
  grid-column: 1 / -1;
  grid-row: 1;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  pointer-events: none;
  z-index: 0;
}
.teneo-detail-grid-line {
  border-left: 0.5px solid rgba(158, 181, 188, 0.15);
  border-right: 0.5px solid rgba(158, 181, 188, 0.15);
}
.teneo-detail-grid-line:first-child { border-left: none; }
.teneo-detail-grid-line:last-child { border-right: none; }

.teneo-detail-content {
  grid-column: 2 / 8;
  grid-row: 1;
  position: relative;
  z-index: 1;
}
.teneo-detail-tabs-section {
  z-index: 1;
}
@media (max-width: 1024px) { .teneo-detail-content { grid-column: 1 / -1; padding: 0 40px; } }
@media (max-width: 640px)  { .teneo-detail-content { grid-column: 1 / -1; padding: 0 20px; } }

/* --- Back Link --- */
.teneo-detail-back {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 64px 0 36px;
  color: #FAFCFC;
  text-decoration: none;
  font-size: 20px;
  line-height: 1.1;
  cursor: pointer;
  transition: opacity 0.2s;
}
.teneo-detail-back:hover { opacity: 0.7; }
.teneo-detail-back svg { width: 24px; height: 24px; flex-shrink: 0; }

/* --- Agent Header --- */
.teneo-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 36px;
  flex-wrap: wrap;
}
.teneo-detail-header-left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.teneo-detail-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #D3F372;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 500;
  color: #000000;
  flex-shrink: 0;
  overflow: hidden;
}
.teneo-detail-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.teneo-detail-name-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.teneo-detail-agent-name {
  font-size: 36px;
  font-weight: 500;
  color: #FAFCFC;
  line-height: 1.3;
}
.teneo-detail-agent-id {
  font-size: 20px;
  color: #FAFCFC;
  line-height: 1.8;
}

.teneo-detail-header-right {
  display: flex;
  align-items: center;
  gap: 36px;
  flex-shrink: 0;
}
.teneo-detail-status {
  display: flex;
  align-items: center;
  gap: 12px;
}
.teneo-detail-status-label {
  font-size: 24px;
  color: #D3F372;
  line-height: 1.5;
}
.teneo-detail-status-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #D3F372;
  flex-shrink: 0;
}
.teneo-detail-status.offline .teneo-detail-status-label { color: #666; }
.teneo-detail-status.offline .teneo-detail-status-dot { background: #666; }

.teneo-detail-chat-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background: #D3F372;
  color: #000000;
  font-family: inherit;
  font-size: 24px;
  font-weight: 400;
  line-height: 1;
  border: none;
  border-radius: 0;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 0.2s;
}
.teneo-detail-chat-btn:hover { opacity: 0.85; }

/* --- Category Pills --- */
.teneo-detail-categories {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 36px;
}
.teneo-detail-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: #222222;
  color: #D3F372;
  font-size: 20px;
  line-height: 0.8;
  border-radius: 0;
  white-space: nowrap;
}

/* --- Description --- */
.teneo-detail-description {
  padding-top: 36px;
  font-size: 20px;
  line-height: 1.5;
  color: #FAFCFC;
}
.teneo-detail-description h2 {
  font-size: 22px;
  font-weight: 500;
  color: #FAFCFC;
  margin: 24px 0 12px;
}
.teneo-detail-description h2:first-child { margin-top: 0; }
.teneo-detail-description h3 {
  font-size: 18px;
  font-weight: 500;
  color: #FAFCFC;
  margin: 24px 0 8px;
}
.teneo-detail-description p { margin-bottom: 16px; }
.teneo-detail-description ul {
  padding-left: 24px;
  margin-bottom: 16px;
}
.teneo-detail-description li { margin-bottom: 6px; }
.teneo-detail-description strong { color: #FAFCFC; }

/* --- Divider --- */
.teneo-detail-divider {
  width: 100%;
  height: 1px;
  background: #222222;
  margin-top: 64px;
}

/* --- Tabs Section --- */
.teneo-detail-tabs-section {
  grid-column: 2 / 8;
  position: relative;
}
.teneo-detail-tabs-section::before,
.teneo-detail-tabs-section::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 1px;
  background: #222222;
}
.teneo-detail-tabs-section::before { top: 0; }
.teneo-detail-tabs-section::after { bottom: 0; }
@media (max-width: 1024px) { .teneo-detail-tabs-section { grid-column: 1 / -1; } }
.teneo-detail-tabs {
  display: flex;
  align-items: flex-end;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  border-right: 1px solid #222222;
}
.teneo-detail-tabs::-webkit-scrollbar { display: none; }
.teneo-detail-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 12px 24px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.1;
  color: #FAFCFC;
  background: #050506;
  border: none;
  border-bottom: 1px solid #D3F372;
  border-radius: 0;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}
.teneo-detail-tab:hover { background: #111; }
.teneo-detail-tab.active {
  background: #D3F372;
  color: #050506;
}

/* --- Tab Content --- */
.teneo-detail-tab-content { display: none; }
.teneo-detail-tab-content.active { display: block; }

/* --- Two-Column Layout --- */
.teneo-detail-columns {
  display: grid;
  grid-template-columns: 2fr 4fr;
  align-items: start;
}
.teneo-detail-col-left {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.teneo-detail-col-right {
  min-width: 0;
}

/* --- Cards --- */
.teneo-detail-card {
  padding: 36px;
  border: 1px solid #222222;
}
.teneo-detail-card-title {
  font-size: 24px;
  font-weight: 400;
  color: #FAFCFC;
  line-height: 1;
  margin-bottom: 24px;
}

/* Statistics */
.teneo-detail-stat-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.teneo-detail-stat-value {
  font-size: 24px;
  color: #D3F372;
  line-height: 1;
}
.teneo-detail-stat-label {
  font-size: 24px;
  color: #FAFCFC;
  line-height: 1;
}

/* Pricing card */
.teneo-detail-pricing-value {
  font-size: 24px;
  color: #D3F372;
  line-height: 1;
}

/* --- Explorer List --- */
.teneo-detail-explorer-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.teneo-detail-explorer-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #050506;
  border: 1px solid #515151;
  border-radius: 0;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s;
}
.teneo-detail-explorer-item .teneo-detail-explorer-left {
  flex: 1;
}
.teneo-detail-explorer-item:hover {
  background: #111;
}
.teneo-detail-explorer-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.teneo-detail-explorer-left svg {
  flex-shrink: 0;
}
.teneo-detail-explorer-icon {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  flex-shrink: 0;
}
.teneo-detail-explorer-name {
  font-size: 24px;
  font-weight: 500;
  color: #FAFCFC;
  line-height: 1;
}
.teneo-detail-explorer-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}
.teneo-detail-explorer-actions button,
.teneo-detail-explorer-actions a {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #FAFCFC;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  text-decoration: none;
}
.teneo-detail-explorer-actions button:hover,
.teneo-detail-explorer-actions a:hover { opacity: 0.6; }
.teneo-detail-explorer-sep {
  width: 1px;
  height: 18px;
  background: #FAFCFC;
}

/* --- About Card --- */
.teneo-detail-about {
  padding: 64px;
  background: #09090a;
  border: 1px solid #222222;
  height: 100%;
}
.teneo-detail-about-title {
  font-size: 24px;
  font-weight: 400;
  color: #D3F372;
  line-height: 1;
  margin-bottom: 10px;
}
.teneo-detail-about-text {
  font-size: 16px;
  color: #FAFCFC;
  line-height: 1.5;
}

/* --- Pricing (tab content) --- */
.teneo-pricing-wrapper {
  display: flex;
  flex-direction: column;
  gap: 36px;
  padding: 24px;
}
.teneo-pricing-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.teneo-pricing-title {
  font-family: 'PP Neue Montreal', sans-serif;
  font-size: 24px;
  font-weight: 400;
  color: #D3F372;
  line-height: 1;
}
.teneo-pricing-desc {
  font-family: 'PP Neue Montreal', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 1.3;
}
.teneo-pricing-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.teneo-pricing-grid-head {
  display: flex;
  gap: 12px;
  align-items: center;
}
.teneo-pricing-grid-head .teneo-pricing-grid-cell {
  background: #222222;
  height: 61px;
  display: flex;
  align-items: center;
  font-family: 'PP Neue Montreal', sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: #D3F372;
  line-height: 1;
  border: 1px solid #000000;
}
.teneo-pricing-grid-head .teneo-pricing-grid-cell--name {
  padding: 0 48px;
}
.teneo-pricing-grid-head .teneo-pricing-grid-cell--price,
.teneo-pricing-grid-head .teneo-pricing-grid-cell--unit {
  justify-content: center;
}
.teneo-pricing-grid-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
.teneo-pricing-grid-row .teneo-pricing-grid-cell {
  background: #222222;
  height: 102px;
  display: flex;
  align-items: center;
  border: 1px solid #000000;
}
.teneo-pricing-grid-cell--name {
  flex: 1;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start !important;
  justify-content: center;
  padding: 0 48px;
  gap: 8px;
}
.teneo-pricing-grid-cell--price,
.teneo-pricing-grid-cell--unit {
  width: 155px;
  flex-shrink: 0;
  justify-content: center;
}
.teneo-pricing-cmd-trigger {
  font-family: 'PP Neue Montreal', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1;
}
.teneo-pricing-cmd-desc {
  font-family: 'PP Neue Montreal', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 1;
}
.teneo-pricing-cmd-price,
.teneo-pricing-cmd-unit {
  font-family: 'PP Neue Montreal', sans-serif;
  font-size: 20px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 1;
  text-align: center;
}

/* --- Commands & Capabilities --- */
.teneo-detail-commands-section {
  padding: 24px;
  background: #09090a;
  border: 1px solid #222222;
  border-top: none;
}
.teneo-cc-group {
  display: flex;
  flex-direction: column;
  gap: 36px;
}
.teneo-cc-group + .teneo-cc-group {
  margin-top: 64px;
}
.teneo-cc-group-title {
  font-family: 'PP Neue Montreal', sans-serif;
  font-size: 24px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 1.5;
}
.teneo-cc-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.teneo-cc-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 16px;
  font-family: 'PP Neue Montreal', sans-serif;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 1;
  cursor: default;
}
.teneo-cc-pill--cap {
  font-size: 20px;
  background: rgba(86, 114, 0, 0.3);
  border: 1px solid #567200;
  border-radius: 3px;
}
.teneo-cc-pill--cmd {
  font-size: 20px;
  background: rgba(0, 51, 255, 0.3);
  border: 1px solid #0033FF;
  border-radius: 4px;
}

/* --- FAQ --- */
.teneo-detail-faq-section {
  padding: 48px 24px;
  background: #09090a;
  border: 1px solid #222222;
}
.teneo-detail-faq-list {
  display: flex;
  flex-direction: column;
}
.teneo-detail-faq-item {
  overflow: hidden;
}
.teneo-detail-faq-item + .teneo-detail-faq-item {
  border-top: 1px solid #222222;
}
.teneo-detail-faq-question {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  cursor: pointer;
  font-family: 'PP Neue Montreal', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 1.5;
  user-select: none;
  transition: opacity 0.15s;
}
.teneo-detail-faq-question:hover { opacity: 0.8; }
.teneo-detail-faq-chevron {
  flex-shrink: 0;
  transition: transform 0.2s ease;
}
.teneo-detail-faq-item.open .teneo-detail-faq-chevron { transform: rotate(180deg); }
.teneo-detail-faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  padding: 0 0 0 24px;
  font-family: 'PP Neue Montreal', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #FAFCFC;
}
.teneo-detail-faq-item.open .teneo-detail-faq-answer {
  max-height: 500px;
  padding: 0 0 16px 24px;
}

/* --- Loading / Error --- */
.teneo-detail-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
}
.teneo-detail-error { text-align: center; padding: 3rem; color: #fca5a5; }
.teneo-detail-error a { color: #D3F372; text-decoration: none; }
.teneo-detail-error a:hover { text-decoration: underline; }

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .teneo-detail-columns { grid-template-columns: 1fr; }
  .teneo-detail-col-left { width: 100%; }
  .teneo-detail-about { border-top: none; }
  .teneo-detail-agent-name { font-size: 28px; }
  .teneo-detail-chat-btn { font-size: 18px; padding: 10px 20px; }
  .teneo-detail-tab { padding: 12px 28px; font-size: 14px; }
}
@media (max-width: 768px) {
  .teneo-detail-back { padding: 40px 0 24px; font-size: 16px; }
  .teneo-detail-header { flex-direction: column; align-items: flex-start; gap: 20px; }
  .teneo-detail-header-right { gap: 20px; flex-wrap: wrap; }
  .teneo-detail-agent-name { font-size: 24px; }
  .teneo-detail-agent-id { font-size: 16px; }
  .teneo-detail-status-label { font-size: 18px; }
  .teneo-detail-status-dot { width: 18px; height: 18px; }
  .teneo-detail-chat-btn { font-size: 16px; padding: 10px 20px; }
  .teneo-detail-pill { font-size: 16px; padding: 8px 10px; }
  .teneo-detail-description { font-size: 16px; padding-top: 24px; }
  .teneo-detail-divider { margin-top: 40px; }
  .teneo-detail-tab { padding: 10px 20px; font-size: 13px; }
  .teneo-detail-card { padding: 24px; }
  .teneo-detail-about { padding: 36px; }
  .teneo-detail-explorer-name { font-size: 18px; }
  .teneo-detail-stat-value, .teneo-detail-stat-label, .teneo-detail-card-title, .teneo-detail-pricing-value { font-size: 20px; }
  .teneo-detail-commands-section, .teneo-detail-faq-section { padding: 36px; }
}
@media (max-width: 480px) {
  .teneo-detail-avatar { width: 56px; height: 56px; font-size: 22px; }
  .teneo-detail-agent-name { font-size: 20px; }
  .teneo-detail-tab { padding: 10px 16px; font-size: 12px; }
  .teneo-detail-about { padding: 24px; }
  .teneo-detail-commands-section, .teneo-detail-faq-section { padding: 24px; }
}
    `;

    class TeneoAgentsWidget {
        constructor(container, options = {}) {
            this.container = container;
            this.options = { ...WIDGET_CONFIG, ...options };
            this.agents = [];
            this.filteredAgents = [];
            this.highlightedAgents = [];
            this.imageLoadStatus = new Map();
            this.moreAgentsCount = 6; // Start with 6 agents in "More Agents" section
            this.showingMoreManage = false;
            this.categories = [];
            this.activeCategory = null;
            
            this.init();
        }

        async init() {
            await this.injectCSS();
            this.setupContainer();
            await this.loadConfiguration();
            await this.loadAgents();
            this.setupEventListeners();
        }

        async checkFontAvailable(fontFamily) {
            // Check if font is available using Font Loading API
            try {
                if (document.fonts && document.fonts.check) {
                    // Wait for fonts to be ready
                    await document.fonts.ready;
                    // Check if font is available
                    const isAvailable = document.fonts.check(`16px "${fontFamily}"`);
                    return isAvailable;
                }
            } catch (e) {
                console.warn('Font check failed:', e);
            }
            
            // Fallback: Try to detect font using canvas method
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const testString = 'mmmmmmmmmmlli';
            const testSize = '72px';
            
            // Measure with fallback font
            ctx.font = `${testSize} monospace`;
            const baselineWidth = ctx.measureText(testString).width;
            
            // Measure with target font
            ctx.font = `${testSize} "${fontFamily}", monospace`;
            const testWidth = ctx.measureText(testString).width;
            
            return baselineWidth !== testWidth;
        }

        async injectCSS() {
            // Check if PPNeueMontreal is available
            const fontAvailable = await this.checkFontAvailable('PPNeueMontreal');
            
            if (!fontAvailable) {
                console.warn('PPNeueMontreal font is not available. Using fallback fonts.');
                console.log('To load PPNeueMontreal, add @font-face rules in the injectCSS() method.');
            } else {
                console.log('PPNeueMontreal font is available ✓');
            }
            
            if (!document.getElementById('teneo-widget-styles')) {
                const style = document.createElement('style');
                style.id = 'teneo-widget-styles';
                style.textContent = widgetCSS;
                document.head.appendChild(style);
            }
        }

        setupContainer() {
            this.container.innerHTML = `
                <div class="teneo-widget-container">
                    <div id="teneo-loading" class="teneo-widget-loading">
                        <div class="teneo-widget-spinner"></div>
                        <p>Loading agents...</p>
                    </div>
                    
                    <div id="teneo-error" class="teneo-widget-error" style="display: none;">
                        <p>Error loading agents. Please try again later.</p>
                    </div>
                    
                    <div id="teneo-content" style="display: none;">
                        <!-- Category Filters -->
                        <div class="teneo-widget-category-row" id="teneo-category-row" style="display: none;">
                            <button class="teneo-widget-category-dropdown" id="teneo-category-all" type="button">
                                <span class="teneo-widget-category-dropdown-icon"></span>
                                <span class="teneo-widget-category-dropdown-label">All Categories</span>
                            </button>
                            <div class="teneo-widget-category-pill-container" id="teneo-category-pills"></div>
                        </div>
                        <!-- Search Bar -->
                        <div class="teneo-widget-search-row">
                            <div class="teneo-widget-search-frame">
                                <div class="teneo-widget-search-icon"></div>
                                <input type="text" class="teneo-widget-search-input" placeholder="Search Agents..." id="teneo-widget-search">
                            </div>
                        </div>
                        
                        <!-- Popular Agents Section -->
                        <div class="teneo-widget-section" id="popular-section">
                            <h2 class="teneo-widget-section-title">Popular Agents</h2>
                            <div class="teneo-widget-grid" id="popular-grid"></div>
                        </div>
                        
                        <!-- More Agents Section -->
                        <div class="teneo-widget-section" id="more-section">
                            <h2 class="teneo-widget-section-title">More Agents</h2>
                            <div class="teneo-widget-grid" id="more-grid"></div>
                            
                            <div class="teneo-widget-load-more" id="load-more" style="display: none;">
                                <button onclick="window.teneoWidget?.showMoreAgents()" class="teneo-widget-load-more-btn">Load more</button>
                            </div>
                        </div>
                        
                        <!-- Search Results Section -->
                        <div class="teneo-widget-section" id="search-results-section" style="display: none;">
                            <h2 class="teneo-widget-section-title">Search Results</h2>
                            <div class="teneo-widget-grid" id="search-results-grid"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Manage Agent Pop-Up -->
                <div class="teneo-manage-popup-backdrop" id="teneo-manage-popup-backdrop">
                    <div class="teneo-manage-popup" id="teneo-manage-popup">
                        <!-- Top Bar -->
                        <div class="teneo-manage-popup-topbar">
                            <div class="teneo-manage-popup-search-row">
                                <div class="teneo-manage-popup-search-frame">
                                    <div class="teneo-manage-popup-search-icon"></div>
                                    <input type="text" class="teneo-manage-popup-search-input" placeholder="Search Agents..." id="teneo-manage-search">
                                </div>
                            </div>
                            <div class="teneo-manage-popup-filter-frame">
                                <button class="teneo-manage-popup-filter-row" id="teneo-manage-filter-btn">
                                    <div class="teneo-manage-popup-filter-frame-inner">
                                        <div class="teneo-manage-popup-filter-icon"></div>
                                        <div class="teneo-manage-popup-filter-label">Filter</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Popular Agents Section -->
                        <div class="teneo-manage-popup-title-frame">
                            <h2 class="teneo-manage-popup-title">Popular Agents</h2>
                        </div>
                        
                        <div class="teneo-manage-popup-section">
                            <div class="teneo-manage-popup-grid-row" id="teneo-manage-popular-grid"></div>
                        </div>
                        
                        <!-- More Agents Section -->
                        <div class="teneo-manage-popup-more-title-frame">
                            <h2 class="teneo-manage-popup-more-title">More Agents</h2>
                        </div>
                        
                        <div class="teneo-manage-popup-section">
                            <div class="teneo-manage-popup-grid-row" id="teneo-manage-more-grid"></div>
                        </div>
                        
                        <!-- Load More Button -->
                        <div class="teneo-manage-popup-load-more-frame" id="teneo-manage-load-more" style="display: none;">
                            <button class="teneo-manage-popup-load-more-row" onclick="window.teneoWidget?.showMoreManageAgents()">
                                <div class="teneo-manage-popup-load-more-frame-inner">
                                    <div class="teneo-manage-popup-load-more-text">Load more</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        async loadConfiguration() {
            const script = document.querySelector('script[src*="teneo-agents-widget"]');
            if (script) {
                const highlight = script.getAttribute('data-highlight');
                const adminApi = script.getAttribute('data-admin-api');
                
                if (highlight) {
                    this.highlightedAgents = highlight.split(',').map(id => id.trim());
                }
                
                if (adminApi) {
                    this.options.adminApiUrl = adminApi;
                    try {
                        const response = await fetch(adminApi);
                        const config = await response.json();
                        if (config.highlightedAgents) {
                            this.highlightedAgents = config.highlightedAgents;
                        }
                        if (config.maxAgents) {
                            this.options.maxAgents = config.maxAgents;
                        }
                    } catch (error) {
                        console.warn('Failed to load admin configuration:', error);
                    }
                }
            }
        }

        async loadAgents() {
            try {
                const response = await fetch(`${this.options.apiUrl}?limit=500`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                this.agents = (data.agents || []).map(agent => {
                    let parsedCategories = [];
                    if (agent.categories) {
                        try {
                            const raw = typeof agent.categories === 'string' ? JSON.parse(agent.categories) : agent.categories;
                            if (Array.isArray(raw)) {
                                parsedCategories = raw;
                            }
                        } catch (e) {
                            console.warn('Failed to parse agent categories', agent.categories, e);
                        }
                    }
                    agent._categories = parsedCategories;
                    return agent;
                });
                
                this.buildCategoryList();
                this.processAgents();
                this.renderAgents();
                this.renderCategoryFilters();
                this.hideLoading();
                
            } catch (error) {
                console.error('Error loading agents:', error);
                this.showError();
                this.hideLoading();
            }
        }

        processAgents() {
            // Sort the agents
            this.agents.sort((a, b) => {
                const aScore = this.getAgentScore(a);
                const bScore = this.getAgentScore(b);
                
                if (aScore !== bScore) {
                    return bScore - aScore;
                }
                
                return (a.agent_name || '').localeCompare(b.agent_name || '');
            });

            // Reset filteredAgents if empty or if they match all agents (no active filter)
            if (this.filteredAgents.length === 0 || this.filteredAgents.length === this.agents.length) {
                this.filteredAgents = [...this.agents];
            } else {
                // Sort the already filtered agents
                this.filteredAgents.sort((a, b) => {
                    const aScore = this.getAgentScore(a);
                    const bScore = this.getAgentScore(b);
                    
                    if (aScore !== bScore) {
                        return bScore - aScore;
                    }
                    
                    return (a.agent_name || '').localeCompare(b.agent_name || '');
                });
            }
        }

        getAgentScore(agent) {
            let score = 0;
            if (agent.is_online) score += 100;
            if (agent.is_active) score += 50;
            if (this.hasValidImage(agent.image_url)) score += 10;
            return score;
        }

        getPopularAgents() {
            const popularIds = this.options.popularAgentIds || [];
            const popularAgents = [];
            const remainingAgents = [];
            
            // First, collect popular agents in the specified order
            // Match against agent_id (string) not id (numeric)
            for (const id of popularIds) {
                const agent = this.filteredAgents.find(a => a.agent_id === id);
                if (agent) {
                    popularAgents.push(agent);
                }
            }
            
            // Then collect remaining agents (excluding popular ones)
            for (const agent of this.filteredAgents) {
                if (!popularIds.includes(agent.agent_id)) {
                    remainingAgents.push(agent);
                }
            }
            
            return { popularAgents, remainingAgents };
        }

        renderAgents() {
            const popularSection = document.getElementById('popular-section');
            const moreSection = document.getElementById('more-section');
            const loadMoreBtn = document.getElementById('load-more');

            if (this.activeCategory) {
                // Category is active - show all filtered agents in the top section
                this.renderAgentGrid('popular-grid', this.filteredAgents);
                if (popularSection) {
                    popularSection.style.display = this.filteredAgents.length > 0 ? 'flex' : 'none';
                }
                if (moreSection) moreSection.style.display = 'none';
                if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            } else {
                // No category - use normal popular/more split
                const { popularAgents, remainingAgents } = this.getPopularAgents();

                this.renderAgentGrid('popular-grid', popularAgents);

                const moreAgents = remainingAgents.slice(0, this.moreAgentsCount);
                this.renderAgentGrid('more-grid', moreAgents);

                if (popularSection) {
                    popularSection.style.display = popularAgents.length > 0 ? 'flex' : 'none';
                }
                if (moreSection) {
                    moreSection.style.display = moreAgents.length > 0 ? 'flex' : 'none';
                }
                if (loadMoreBtn) {
                    const hasMoreAgents = remainingAgents.length > this.moreAgentsCount;
                    loadMoreBtn.style.display = hasMoreAgents ? 'block' : 'none';
                }
            }
        }

        renderSearchResults() {
            // Show all search results
            this.renderAgentGrid('search-results-grid', this.filteredAgents);
        }

        renderAgentGrid(gridId, agents) {
            const grid = document.getElementById(gridId);
            if (!grid) return;
            
            grid.innerHTML = agents.map(agent => this.createAgentCard(agent)).join('');
            
            setTimeout(() => {
                agents.forEach(agent => this.loadAgentImage(agent));
            }, 100);
        }

        getAgentLink(agent) {
            if (!agent) {
                return { url: './', sameTab: true };
            }
            // All agents link to the detail page: /agent-ecosystem/agent-detail?agent={agent_id}
            const detailUrl = `${WIDGET_CONFIG.detailPageUrl}?agent=${encodeURIComponent(agent.agent_id)}`;
            return { url: detailUrl, sameTab: true };
        }

        createAgentCard(agent) {
            const isOnline = agent.is_online;
            const imageInfo = this.convertIpfsUrl(agent.image_url);
            const cardId = `teneo-card-${agent.id}`;
            const linkInfo = this.getAgentLink(agent);
            const targetUrl = linkInfo.url;
            const targetAttr = linkInfo.sameTab ? '_self' : '_blank';
            const hasCategories = agent._categories && agent._categories.length > 0;

            return `
                <div class="teneo-widget-card ${isOnline ? 'online' : 'offline'} ${hasCategories ? 'teneo-widget-card-has-categories' : ''}" id="${cardId}">
                    <div class="teneo-widget-card-content">
                        <div class="teneo-widget-card-top">
                            <div class="teneo-widget-header-card">
                                <div class="teneo-widget-avatar-section">
                                    <div class="teneo-widget-avatar">
                                        ${imageInfo 
                                            ? `<img class="teneo-widget-image" alt="${agent.agent_name}" loading="lazy" style="display: none;">`
                                            : ''
                                        }
                                        <div class="teneo-widget-initials" style="${imageInfo ? '' : 'display: flex;'}">
                                            <div class="teneo-widget-initials-text">${this.getInitials(agent.agent_name)}</div>
                                        </div>
                                    </div>
                                    <div class="teneo-widget-info">
                                        <div class="teneo-widget-name-container">
                                            <div class="teneo-widget-name">${agent.agent_name || 'Unnamed Agent'}</div>
                                        </div>
                                        <div class="teneo-widget-creator-container">
                                            <div class="teneo-widget-creator">${agent.agent_id || 'Unknown'}</div>
                                        </div>
                                        ${ /* Status commented out for now
                                        <div class="teneo-widget-status-text ${isOnline ? 'online' : 'offline'}">
                                            <div class="teneo-widget-status-dot"></div>
                                            <div class="teneo-widget-status-label">${isOnline ? 'Online' : 'Offline'}</div>
                                        </div>
                                        */ ''}
                                    </div>
                                </div>
                            </div>
                            ${agent._categories && agent._categories.length > 0 ? `
                            <div class="teneo-widget-card-categories">
                                ${agent._categories.map(cat => `<span class="teneo-widget-card-category-pill">${cat}</span>`).join('')}
                            </div>
                            ` : ''}
                            <div class="teneo-widget-description">
                                <p>${agent.description || 'No description available'}</p>
                            </div>
                        </div>
                        <div class="teneo-widget-actions">
                            <a href="${targetUrl}" target="${targetAttr}" class="teneo-widget-btn">
                                <div class="btn-text">View Agent</div>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }

        async loadAgentImage(agent) {
            const imageInfo = this.convertIpfsUrl(agent.image_url);
            if (!imageInfo) {
                this.imageLoadStatus.set(agent.id, false);
                return;
            }

            const cardElement = document.getElementById(`teneo-card-${agent.id}`);
            if (!cardElement) return;

            const imgElement = cardElement.querySelector('.teneo-widget-image');
            const initialsElement = cardElement.querySelector('.teneo-widget-initials');

            try {
                await this.loadImageWithFallback(imageInfo, imgElement);
                
                imgElement.style.display = 'block';
                initialsElement.style.display = 'none';
                this.imageLoadStatus.set(agent.id, true);
                
            } catch (error) {
                // Silently fail - show initials instead of image
                imgElement.style.display = 'none';
                initialsElement.style.display = 'flex';
                this.imageLoadStatus.set(agent.id, false);
                // Only log if it's not a validation error (to avoid console spam)
                if (!error.message.includes('Invalid') && !error.message.includes('Timeout')) {
                    console.debug('Failed to load image for agent:', agent.agent_name, error.message);
                }
            }
        }

        buildCategoryList() {
            const set = new Set();
            this.agents.forEach(agent => {
                (agent._categories || []).forEach(cat => {
                    if (cat && typeof cat === 'string') {
                        set.add(cat);
                    }
                });
            });
            this.categories = Array.from(set).sort((a, b) => a.localeCompare(b));
        }

        renderCategoryFilters() {
            const row = document.getElementById('teneo-category-row');
            const container = document.getElementById('teneo-category-pills');
            if (!row || !container) return;

            if (!this.categories || this.categories.length === 0) {
                row.style.display = 'none';
                return;
            }

            row.style.display = 'flex';
            container.innerHTML = this.categories.map(cat => `
                <button class="teneo-widget-category-pill" data-category="${cat}">
                    ${cat}
                </button>
            `).join('');

            this.updateCategoryActivePills();
        }

        updateCategoryActivePills() {
            const row = document.getElementById('teneo-category-row');
            if (!row) return;

            const activeCategory = this.activeCategory;

            // Highlight dropdown when no category selected
            const dropdown = row.querySelector('.teneo-widget-category-dropdown');
            if (dropdown) {
                if (!activeCategory) {
                    dropdown.classList.add('active');
                } else {
                    dropdown.classList.remove('active');
                }
            }

            // Highlight pills when a category is selected
            const pills = row.querySelectorAll('.teneo-widget-category-pill');
            pills.forEach(pill => {
                const category = pill.getAttribute('data-category');
                if (activeCategory && category === activeCategory) {
                    pill.classList.add('active');
                } else {
                    pill.classList.remove('active');
                }
            });
        }

        setupEventListeners() {
            // Search input in main widget
            const widgetSearch = document.getElementById('teneo-widget-search');
            if (widgetSearch) {
                const debouncedFilter = this.debounce(() => {
                    this.filterAgents();
                }, 300);
                widgetSearch.addEventListener('input', debouncedFilter);
            }
            
            // Search input in manage popup
            const manageSearch = document.getElementById('teneo-manage-search');
            if (manageSearch) {
                const debouncedManageFilter = this.debounce(() => {
                    this.filterManageAgents();
                }, 300);
                manageSearch.addEventListener('input', debouncedManageFilter);
            }
            
            // Filter button
            const filterBtn = document.getElementById('teneo-manage-filter-btn');
            if (filterBtn) {
                filterBtn.addEventListener('click', () => {
                    // Filter functionality can be added here
                });
            }
            
            // Category filter interactions
            const categoryRow = document.getElementById('teneo-category-row');
            if (categoryRow) {
                const allButton = document.getElementById('teneo-category-all');
                if (allButton) {
                    allButton.addEventListener('click', () => {
                        this.activeCategory = null;
                        this.updateCategoryActivePills();
                        this.filterAgents();
                    });
                }

                categoryRow.addEventListener('click', (e) => {
                    const pill = e.target.closest('.teneo-widget-category-pill');
                    if (!pill) return;

                    const category = pill.getAttribute('data-category');
                    this.activeCategory = category || null;
                    this.updateCategoryActivePills();
                    this.filterAgents();
                });
            }
            
            // Close popup on backdrop click
            const backdrop = document.getElementById('teneo-manage-popup-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', (e) => {
                    if (e.target === backdrop) {
                        this.hideManagePopup();
                    }
                });
            }
            
            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.hideManagePopup();
                }
            });
        }

        showMoreAgents() {
            // Increment by 6 more agents each time
            this.moreAgentsCount += 6;
            this.renderAgents();
        }

        showManagePopup() {
            const backdrop = document.getElementById('teneo-manage-popup-backdrop');
            if (backdrop) {
                backdrop.classList.add('active');
                this.renderManageAgents();
            }
        }

        hideManagePopup() {
            const backdrop = document.getElementById('teneo-manage-popup-backdrop');
            if (backdrop) {
                backdrop.classList.remove('active');
            }
        }

        renderManageAgents() {
            const { popularAgents, remainingAgents } = this.getPopularAgents();
            
            // Render popular agents
            this.renderManageAgentGrid('teneo-manage-popular-grid', popularAgents);
            
            // Render more agents from remaining agents
            const moreAgentsStart = 0;
            const moreAgentsEnd = this.showingMoreManage ? this.options.maxAgents : 6;
            const moreAgents = remainingAgents.slice(moreAgentsStart, moreAgentsEnd);
            this.renderManageAgentGrid('teneo-manage-more-grid', moreAgents);
            
            const loadMoreBtn = document.getElementById('teneo-manage-load-more');
            if (loadMoreBtn) {
                const hasMoreAgents = remainingAgents.length > moreAgentsEnd;
                loadMoreBtn.style.display = hasMoreAgents && !this.showingMoreManage ? 'flex' : 'none';
            }
        }

        renderManageAgentGrid(gridId, agents) {
            const grid = document.getElementById(gridId);
            if (!grid) return;
            
            grid.innerHTML = agents.map(agent => this.createAgentCard(agent)).join('');
            
            setTimeout(() => {
                agents.forEach(agent => this.loadAgentImage(agent));
            }, 100);
        }

        filterAgents() {
            const searchTerm = document.getElementById('teneo-widget-search')?.value.trim().toLowerCase() || '';
            const popularSection = document.getElementById('popular-section');
            const moreSection = document.getElementById('more-section');
            const searchResultsSection = document.getElementById('search-results-section');
            const activeCategory = this.activeCategory;
            
            // Update section title based on active category
            const popularTitle = popularSection?.querySelector('.teneo-widget-section-title');
            if (popularTitle) {
                popularTitle.textContent = activeCategory ? activeCategory : 'Popular Agents';
            }

            if (!searchTerm) {
                // No search term - category-only filtering, keep Popular/More layout
                let baseAgents = this.agents;
                if (activeCategory) {
                    baseAgents = baseAgents.filter(agent => (agent._categories || []).includes(activeCategory));
                }
                this.filteredAgents = [...baseAgents];
                if (searchResultsSection) searchResultsSection.style.display = 'none';
                this.processAgents();
                this.renderAgents();
            } else {
                // Has search term - hide sections, show only search results
                this.filteredAgents = this.agents.filter(agent => {
                    const agentName = (agent.agent_name || '').toLowerCase();
                    const creatorName = (agent.creator_name || '').toLowerCase();
                    const description = (agent.description || '').toLowerCase();
                    const inCategory = !activeCategory || (agent._categories || []).includes(activeCategory);

                    const matchesSearch =
                        agentName.includes(searchTerm) ||
                        creatorName.includes(searchTerm) ||
                        description.includes(searchTerm);

                    return inCategory && matchesSearch;
                });
                
                if (popularSection) popularSection.style.display = 'none';
                if (moreSection) moreSection.style.display = 'none';
                
                if (this.filteredAgents.length > 0) {
                    // Sort filtered results
                    this.filteredAgents.sort((a, b) => {
                        const aScore = this.getAgentScore(a);
                        const bScore = this.getAgentScore(b);
                        
                        if (aScore !== bScore) {
                            return bScore - aScore;
                        }
                        
                        return (a.agent_name || '').localeCompare(b.agent_name || '');
                    });
                    
                    if (searchResultsSection) searchResultsSection.style.display = 'flex';
                    this.renderSearchResults();
                } else {
                    // No results found
                    if (searchResultsSection) {
                        searchResultsSection.style.display = 'flex';
                        const searchGrid = document.getElementById('search-results-grid');
                        if (searchGrid) {
                            searchGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #BAD3D8; padding: 2rem; font-size: 1.2rem;">No agents found matching your search.</div>';
                        }
                    }
                }
            }
        }

        filterManageAgents() {
            const searchTerm = document.getElementById('teneo-manage-search')?.value.toLowerCase() || '';
            
            if (!searchTerm) {
                this.filteredAgents = [...this.agents];
            } else {
                this.filteredAgents = this.agents.filter(agent => {
                    return agent.agent_name?.toLowerCase().includes(searchTerm) ||
                           agent.creator_name?.toLowerCase().includes(searchTerm) ||
                           agent.description?.toLowerCase().includes(searchTerm);
                });
            }
            
            this.processAgents();
            this.renderManageAgents();
        }

        showMoreManageAgents() {
            this.showingMoreManage = true;
            this.renderManageAgents();
        }

        getInitials(name) {
            if (!name) return '?';
            return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
        }

        formatAddress(address) {
            if (!address) return 'Unknown';
            return `${address.slice(0, 6)}...${address.slice(-4)}`;
        }

        hasValidImage(imageUrl) {
            if (!imageUrl || imageUrl.trim() === '') return false;
            return imageUrl.startsWith('ipfs://') || 
                   imageUrl.startsWith('http://') || 
                   imageUrl.startsWith('https://');
        }

        convertIpfsUrl(ipfsUrl) {
            if (!ipfsUrl) return null;
            
            // Validate URL - must start with http://, https://, or ipfs://
            if (!ipfsUrl.startsWith('http://') && 
                !ipfsUrl.startsWith('https://') && 
                !ipfsUrl.startsWith('ipfs://')) {
                console.warn('Invalid image URL format:', ipfsUrl);
                return null;
            }
            
            if (ipfsUrl.startsWith('ipfs://')) {
                // Extract only the hash part (before the first slash after ipfs://)
                // Example: ipfs://bafybeifygoi4xhcrm4q5km2efi6h7qbryb2e2gtvxga2vtp6kynuycx2mq/agent_image_1762487034.png
                // Hash: bafybeifygoi4xhcrm4q5km2efi6h7qbryb2e2gtvxga2vtp6kynuycx2mq
                // Convert to: https://ipfs.io/ipfs/bafybeifygoi4xhcrm4q5km2efi6h7qbryb2e2gtvxga2vtp6kynuycx2mq
                const pathAfterIpfs = ipfsUrl.replace('ipfs://', '');
                const hash = pathAfterIpfs.split('/')[0]; // Get only the hash, ignore filename/path
                
                if (!hash || hash.length === 0) {
                    console.warn('Invalid IPFS hash:', ipfsUrl);
                    return null;
                }
                
                return {
                    gateways: [
                        `https://gateway.pinata.cloud/ipfs/${hash}`,
                        `https://ipfs.io/ipfs/${hash}`,
                        `https://4everland.io/ipfs/${hash}`
                    ],
                    isIpfs: true
                };
            }
            
            return { url: ipfsUrl, isIpfs: false };
        }

        async loadImageWithFallback(imageInfo, imgElement) {
            if (!imageInfo || !imgElement) {
                throw new Error('Invalid image info or element');
            }
            
            if (!imageInfo.isIpfs) {
                // Validate URL format before attempting to load
                if (!imageInfo.url || 
                    (!imageInfo.url.startsWith('http://') && !imageInfo.url.startsWith('https://'))) {
                    throw new Error('Invalid URL format');
                }
                
                // For non-IPFS URLs, verify the image loads before setting it
                return new Promise((resolve, reject) => {
                    const testImg = new Image();
                    const timeout = setTimeout(() => {
                        testImg.onerror = null;
                        testImg.onload = null;
                        reject(new Error('Timeout'));
                    }, 5000);
                    
                    testImg.onload = () => {
                        clearTimeout(timeout);
                        imgElement.src = imageInfo.url;
                        resolve();
                    };
                    
                    testImg.onerror = () => {
                        clearTimeout(timeout);
                        reject(new Error('Load failed'));
                    };
                    
                    testImg.src = imageInfo.url;
                });
            }

            for (const gateway of imageInfo.gateways) {
                try {
                    await new Promise((resolve, reject) => {
                        const testImg = new Image();
                        const timeout = setTimeout(() => reject(new Error('Timeout')), 5000);
                        
                        testImg.onload = () => {
                            clearTimeout(timeout);
                            imgElement.src = gateway;
                            resolve();
                        };
                        
                        testImg.onerror = () => {
                            clearTimeout(timeout);
                            reject(new Error('Load failed'));
                        };
                        
                        testImg.src = gateway;
                    });
                    return;
                } catch (error) {
                    continue;
                }
            }
            throw new Error('All gateways failed');
        }

        hideLoading() {
            const loading = document.getElementById('teneo-loading');
            const content = document.getElementById('teneo-content');
            if (loading) loading.style.display = 'none';
            if (content) content.style.display = 'block';
            // Re-setup event listeners after content is shown to ensure search works
            this.setupEventListeners();
        }

        showError() {
            const loading = document.getElementById('teneo-loading');
            const error = document.getElementById('teneo-error');
            if (loading) loading.style.display = 'none';
            if (error) error.style.display = 'block';
        }

        debounce(func, wait) {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    func.apply(this, args);
                }, wait);
            };
        }
    }

    // ========================================================================
    // TeneoAgentDetail — Detail page view (separate page, reads ?agent= param)
    // ========================================================================
    class TeneoAgentDetail {
        constructor(container) {
            this.container = container;
            this.agent = null;
            this.activeTab = 'readme';
            this.listPageUrl = '/agent-ecosystem';
            this.init();
        }

        async init() {
            this.injectCSS();
            this.container.innerHTML = `
                <div class="teneo-detail-content">
                    <div class="teneo-detail-loading">
                        <div class="teneo-widget-spinner"></div>
                        <p style="color:#BAD3D8;">Loading agent...</p>
                    </div>
                </div>
            `;
            const agentId = this.parseUrlParam();
            if (!agentId) {
                this.showError('No agent specified. <a href="' + this.listPageUrl + '">Browse all agents</a>');
                return;
            }
            await this.loadAgent(agentId);
        }

        injectCSS() {
            if (!document.getElementById('teneo-widget-styles')) {
                const style = document.createElement('style');
                style.id = 'teneo-widget-styles';
                style.textContent = widgetCSS;
                document.head.appendChild(style);
            }
            if (!document.getElementById('teneo-detail-styles')) {
                const style = document.createElement('style');
                style.id = 'teneo-detail-styles';
                style.textContent = detailCSS;
                document.head.appendChild(style);
            }
        }

        parseUrlParam() {
            const params = new URLSearchParams(window.location.search);
            return params.get('agent');
        }

        parseJsonField(value, fallback) {
            if (value === null || value === undefined) return fallback;
            if (typeof value === 'string') {
                try { return JSON.parse(value); } catch (e) { return fallback; }
            }
            return value;
        }

        async loadAgent(agentId) {
            try {
                const response = await fetch(`${WIDGET_CONFIG.apiUrl}?limit=500`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                const agents = data.agents || [];
                this.agent = agents.find(a => a.agent_id === agentId);

                if (!this.agent) {
                    this.showError('Agent "' + agentId + '" not found. <a href="' + this.listPageUrl + '">Browse all agents</a>');
                    return;
                }

                // Parse JSON string fields
                this.agent._categories = this.parseJsonField(this.agent.categories, []);
                if (!Array.isArray(this.agent._categories)) this.agent._categories = [];
                this.agent.commands = this.parseJsonField(this.agent.commands, []);
                this.agent.capabilities = this.parseJsonField(this.agent.capabilities, []);
                this.agent.faq_items = this.parseJsonField(this.agent.faq_items, []);
                this.agent.network_request_counts = this.parseJsonField(this.agent.network_request_counts, {});

                this.render();
            } catch (error) {
                console.error('Error loading agent:', error);
                this.showError('Failed to load agent data. <a href="' + this.listPageUrl + '">Back to agents</a>');
            }
        }

        showError(message) {
            this.container.innerHTML = `
                <div class="teneo-detail-content">
                    <a href="${this.listPageUrl}" class="teneo-detail-back">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        Back to Agents
                    </a>
                    <div class="teneo-detail-error"><p>${message}</p></div>
                </div>
            `;
        }

        render() {
            const agent = this.agent;
            const networks = agent.network_request_counts || {};

            this.container.innerHTML = `
                <div class="teneo-detail-grid-lines">${'<div class="teneo-detail-grid-line"></div>'.repeat(8)}</div>
                <div class="teneo-detail-content">
                    ${this.renderBackNav()}
                    ${this.renderHeader()}
                    ${this.renderCategories()}
                    ${this.renderDescription()}
                    <div class="teneo-detail-divider"></div>
                </div>
                <div class="teneo-detail-tabs-section">
                    <div class="teneo-detail-columns">
                        <div class="teneo-detail-col-left">
                            <div class="teneo-detail-card">
                                <div class="teneo-detail-card-title">Statistics</div>
                                <div class="teneo-detail-stat-row">
                                    <span class="teneo-detail-stat-value">${this.formatNumber(agent.request_count || 0)}</span>
                                    <span class="teneo-detail-stat-label">Total Agent Requests</span>
                                </div>
                            </div>
                            <div class="teneo-detail-card">
                                <div class="teneo-detail-card-title">Pricing</div>
                                <span class="teneo-detail-pricing-value">Pay per event</span>
                            </div>
                            ${Object.keys(networks).length > 0 ? `
                            <div class="teneo-detail-card">
                                <div class="teneo-detail-card-title">Explorer</div>
                                <div class="teneo-detail-explorer-list">
                                    ${Object.entries(networks).map(([network, count]) => this.renderExplorerItem(network, count)).join('')}
                                </div>
                            </div>
                            ` : ''}
                        </div>
                        <div class="teneo-detail-col-right">
                            ${this.renderTabs()}
                            ${this.renderReadmeTab()}
                            ${this.renderPricingTab()}
                            ${this.renderCommandsTab()}
                            ${this.renderFAQTab()}
                        </div>
                    </div>
                </div>
            `;
            this.loadDetailAvatar();
            this.setupDetailEvents();
        }

        renderBackNav() {
            return `
                <a href="${this.listPageUrl}" class="teneo-detail-back">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    Back
                </a>
            `;
        }

        renderHeader() {
            const agent = this.agent;
            const isOnline = agent.is_online;
            const chatLink = this.getChatLink();
            const imageInfo = this.convertIpfsUrl(agent.image_url);
            const statusClass = isOnline ? '' : ' offline';

            return `
                <div class="teneo-detail-header">
                    <div class="teneo-detail-header-left">
                        <div class="teneo-detail-avatar" id="teneo-detail-avatar-wrap">
                            ${imageInfo
                                ? `<img id="teneo-detail-avatar-img" alt="${agent.agent_name}" style="display:none;">`
                                : ''
                            }
                            <span id="teneo-detail-avatar-fallback" style="${imageInfo ? 'display:none;' : ''}">
                                ${this.getInitials(agent.agent_name)}
                            </span>
                        </div>
                        <div class="teneo-detail-name-block">
                            <div class="teneo-detail-agent-name">${agent.agent_name || 'Unnamed Agent'}</div>
                            <div class="teneo-detail-agent-id">${agent.agent_id || ''}</div>
                        </div>
                    </div>
                    <div class="teneo-detail-header-right">
                        <div class="teneo-detail-status${statusClass}">
                            <span class="teneo-detail-status-label">${isOnline ? 'Online' : 'Offline'}</span>
                            <span class="teneo-detail-status-dot"></span>
                        </div>
                        <a href="${chatLink.url}" target="${chatLink.sameTab ? '_self' : '_blank'}" class="teneo-detail-chat-btn">Chat now</a>
                    </div>
                </div>
            `;
        }

        renderCategories() {
            const cats = this.agent._categories || [];
            if (cats.length === 0) return '';
            return `
                <div class="teneo-detail-categories">
                    ${cats.map(c => `<span class="teneo-detail-pill">${c}</span>`).join('')}
                </div>
            `;
        }

        renderDescription() {
            const desc = this.agent.short_description || this.agent.description || '';
            if (!desc) return '';
            return `<div class="teneo-detail-description">${desc}</div>`;
        }

        renderTabs() {
            const tabs = [
                { id: 'readme', label: 'Read Me' },
                { id: 'pricing', label: 'Pricing' },
                { id: 'commands', label: 'Commands & Capabilities' },
                { id: 'faq', label: 'FAQ' }
            ];
            const faqItems = this.agent.faq_items;
            const showFaq = Array.isArray(faqItems) && faqItems.length > 0;

            return `
                <div class="teneo-detail-tabs">
                    ${tabs.filter(t => t.id !== 'faq' || showFaq).map(t =>
                        `<button class="teneo-detail-tab${t.id === this.activeTab ? ' active' : ''}" data-tab="${t.id}">${t.label}</button>`
                    ).join('')}
                </div>
            `;
        }

        renderReadmeTab() {
            const desc = this.agent.description || '';
            return `
                <div class="teneo-detail-tab-content${this.activeTab === 'readme' ? ' active' : ''}" data-tab-content="readme">
                    <div class="teneo-detail-about">
                        <div class="teneo-detail-about-text teneo-detail-description">${desc ? this.renderMarkdown(desc) : 'No description available.'}</div>
                    </div>
                </div>
            `;
        }

        renderStatisticsTab() {
            // Statistics tab removed — sidebar is always visible
            return '';
        }

        getChainLogo(network) {
            const logos = {
                peaq: `<svg width="24" height="24" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="12" height="12" rx="6" fill="white"/><path d="M8.28751 7.99996H8.06905L7.87806 7.97853C7.63869 7.94445 7.33389 7.85319 7.12228 7.73532C7.03999 7.68948 6.87655 7.55007 6.83996 7.46358C6.8141 7.40247 6.81266 7.24092 6.82054 7.17296C6.82536 7.13144 6.85609 7.09282 6.87296 7.05567L7.76231 5.73991C7.7937 5.70018 7.83557 5.67672 7.88565 5.66908L8.41744 5.66895C8.48105 5.68805 8.54412 5.76216 8.52977 5.83196C8.24065 6.25557 7.94249 6.6737 7.65044 7.09557C7.6523 7.15078 7.62623 7.23976 7.69396 7.26376C7.77531 7.29257 7.89468 7.31387 7.9809 7.32342C8.35446 7.36481 8.73923 7.28979 8.99659 6.99845C9.02423 6.96719 9.04671 6.92688 9.07315 6.89715C9.09959 6.86742 9.1361 6.83998 9.16345 6.80967C9.62322 6.29991 9.54918 5.43857 9.05009 4.98257C8.48736 4.46837 7.68575 4.54941 7.1415 5.04477C7.01288 5.16181 6.91756 5.29911 6.81666 5.43961C6.60987 5.72758 6.41658 6.02194 6.23388 6.32561C5.77514 7.08809 5.07975 7.8534 4.1546 7.97862L3.95528 7.99996H3.74094L3.55457 7.97804C2.7073 7.83588 2.03089 7.09312 1.93147 6.23929L1.91906 6.10041C1.92161 6.0317 1.91563 5.96162 1.91906 5.89303C1.94104 5.45227 2.11648 5.02056 2.41571 4.69846C2.71192 4.37964 3.01371 4.1552 3.44493 4.05435C4.00527 3.92332 4.50312 4.03928 5.00216 4.29428C5.03033 4.30869 5.06853 4.31662 5.09435 4.33427C5.12632 4.3561 5.24417 4.47995 5.26269 4.51329C5.30357 4.58699 5.30312 4.74438 5.29491 4.82916C5.28851 4.89518 5.25506 4.92918 5.22144 4.97921C4.92799 5.4159 4.62398 5.84694 4.32413 6.27865C4.28697 6.30626 4.23916 6.3291 4.19246 6.33283C4.01567 6.34691 3.81969 6.32283 3.64095 6.33167C3.61963 6.32905 3.58357 6.29389 3.57796 6.27479C3.57396 6.26125 3.57376 6.18856 3.5759 6.17282C3.57776 6.15929 3.587 6.15165 3.59335 6.1406L4.46331 4.94222C4.46859 4.92901 4.4688 4.83415 4.4655 4.81775C4.46203 4.80056 4.44021 4.77872 4.42408 4.77232C3.9806 4.59662 3.51353 4.64445 3.13131 4.93329C2.75346 5.21881 2.55707 5.61158 2.58277 6.09418C2.61927 6.77895 3.2754 7.36394 3.95346 7.33243C5.02336 7.28269 5.51671 6.11553 6.04838 5.35503C6.55051 4.63673 7.16394 4.03641 8.09153 4.00158C9.00237 3.96737 9.85971 4.53347 10.1156 5.42437C10.1333 5.48602 10.1591 5.57508 10.1632 5.63777C10.1783 5.86924 10.1519 6.11764 10.1625 6.35085C9.99125 7.24669 9.19517 7.95213 8.28751 8V7.99996Z" fill="#6666FD"/></svg>`,
                base: `<svg width="24" height="24" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0Z" fill="#FDFDFE"/><path d="M2.71304 2.43727C2.71057 2.43727 2.70807 2.43765 2.70571 2.43838C2.47748 2.5096 2.40365 2.65464 2.38882 2.8882V9.08944C2.41118 9.30559 2.48571 9.49938 2.72795 9.52174H9.21242C9.38012 9.50311 9.51056 9.3764 9.52919 9.20497L9.51539 3.17245C9.51466 2.85398 9.45889 2.4574 9.14161 2.42981L2.71304 2.43727Z" fill="#0052FF"/></svg>`,
                avalanche: `<svg width="24" height="24" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip_avax)"><path d="M12 6C12 9.31684 9.31241 12 6.00285 12C2.6933 12 0 9.31684 0 6C0 2.68316 2.68759 0 5.99715 0C9.3067 0 11.9943 2.68887 11.9943 6H12ZM5.9572 2.22645C5.91155 2.23216 5.86591 2.2607 5.83167 2.28925C4.66191 4.29876 3.49215 6.31399 2.34522 8.33492C2.31669 8.48335 2.41369 8.62036 2.56776 8.63178C3.36091 8.62036 4.15977 8.64891 4.95292 8.61465L5.03852 8.56898C5.83737 7.23311 6.6077 5.87441 7.37803 4.52141C7.40656 4.43578 7.36662 4.36727 7.32668 4.29305C6.99572 3.63083 6.52782 2.98573 6.19116 2.3235C6.13409 2.24929 6.0428 2.20932 5.9515 2.22645H5.9572ZM8.00571 5.81161C7.95435 5.82303 7.89729 5.86299 7.86876 5.90295C7.46362 6.67935 6.93295 7.43292 6.53352 8.20932C6.48787 8.29496 6.46505 8.34063 6.47646 8.44339C6.49358 8.53473 6.602 8.62607 6.699 8.62607H9.41512C9.65478 8.59182 9.69472 8.42626 9.59772 8.22645C9.21541 7.45005 8.66191 6.70219 8.26819 5.92579C8.19971 5.82873 8.12554 5.78877 8 5.81161H8.00571Z" fill="#EA4242"/><path d="M5.9589 2.22537C6.05591 2.20825 6.1415 2.24819 6.19856 2.32237C6.54093 2.98999 7.00312 3.62908 7.33408 4.29099C7.36832 4.36517 7.40826 4.43364 7.38544 4.51923C6.61511 5.87159 5.83907 7.22965 5.04592 8.56488L4.96033 8.61053C4.16718 8.64477 3.36832 8.61053 2.57516 8.62765C2.4211 8.62194 2.32409 8.47929 2.35262 8.33093C3.49956 6.31096 4.66932 4.29669 5.83907 2.28814C5.87331 2.2596 5.91896 2.23107 5.96461 2.22537H5.9589Z" fill="#FFFEFE"/><path d="M8.00903 5.80887C8.13456 5.78605 8.20304 5.82599 8.27722 5.92299C8.67094 6.69903 9.22443 7.44653 9.60675 8.22257C9.70375 8.42228 9.66381 8.58776 9.42415 8.622H6.70803C6.61103 8.622 6.50261 8.5307 6.48549 8.4394C6.46837 8.33669 6.4969 8.29104 6.54255 8.20545C6.94198 7.42941 7.47265 6.6762 7.87779 5.90017C7.90632 5.86023 7.96338 5.81458 8.01473 5.80887H8.00903Z" fill="#FFFEFE"/></g><defs><clipPath id="clip_avax"><rect width="12" height="12" fill="white"/></clipPath></defs></svg>`,
            };
            return logos[network.toLowerCase()] || `<div class="teneo-detail-explorer-icon" style="background:${CHAIN_COLORS[network.toLowerCase()] || '#888'}"></div>`;
        }

        renderExplorerItem(network, count) {
            const explorerUrl = this.getExplorerUrl(network);
            const displayName = network.charAt(0).toUpperCase() + network.slice(1);

            return `
                <a class="teneo-detail-explorer-item" href="${explorerUrl}" target="_blank" rel="noopener" title="Open ${displayName} explorer">
                    <div class="teneo-detail-explorer-left">
                        ${this.getChainLogo(network)}
                        <span class="teneo-detail-explorer-name">${displayName}</span>
                    </div>
                    <svg width="1" height="18" viewBox="0 0 1 18" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" x2="0.5" y2="18" stroke="white"/></svg>
                    <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 5.83333L16.5 0.5M16.5 0.5H11.1667M16.5 0.5L9.38889 7.61111M6.72222 2.27778H4.76667C3.27319 2.27778 2.52646 2.27778 1.95603 2.56843C1.45426 2.82409 1.04631 3.23204 0.790649 3.7338C0.5 4.30423 0.5 5.05097 0.5 6.54445V12.2333C0.5 13.7268 0.5 14.4735 0.790649 15.044C1.04631 15.5457 1.45426 15.9537 1.95603 16.2094C2.52646 16.5 3.27319 16.5 4.76667 16.5H10.4556C11.949 16.5 12.6958 16.5 13.2662 16.2094C13.768 15.9537 14.1759 15.5457 14.4316 15.044C14.7222 14.4735 14.7222 13.7268 14.7222 12.2333V10.2778" stroke="white" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </a>
            `;
        }

        renderAboutCard() {
            const agent = this.agent;
            const shortDesc = agent.short_description || agent.description || '';
            const aboutText = shortDesc.length > 400 ? shortDesc.slice(0, 400) + '...' : shortDesc;

            return `
                <div class="teneo-detail-about">
                    <div class="teneo-detail-about-text">${aboutText}</div>
                </div>
            `;
        }

        renderPricingTab() {
            const commands = this.agent.commands || [];
            if (commands.length === 0) {
                return `<div class="teneo-detail-tab-content${this.activeTab === 'pricing' ? ' active' : ''}" data-tab-content="pricing">
                    <div class="teneo-detail-tab-placeholder">No pricing information available.</div>
                </div>`;
            }

            return `
                <div class="teneo-detail-tab-content${this.activeTab === 'pricing' ? ' active' : ''}" data-tab-content="pricing">
                    <div class="teneo-pricing-wrapper">
                        <div class="teneo-pricing-header">
                            <div class="teneo-pricing-title">Pay per event</div>
                            <div class="teneo-pricing-desc">Each command is priced individually based on the task it performs. Prices are shown per unit of work completed.</div>
                        </div>
                        <div class="teneo-pricing-grid">
                            <div class="teneo-pricing-grid-head">
                                <div class="teneo-pricing-grid-cell teneo-pricing-grid-cell--name">Event / Command</div>
                                <div class="teneo-pricing-grid-cell teneo-pricing-grid-cell--price">Price</div>
                                <div class="teneo-pricing-grid-cell teneo-pricing-grid-cell--unit">Unit</div>
                            </div>
                            ${commands.map(cmd => {
                                const price = cmd.pricePerUnit;
                                const priceDisplay = price === 0 ? 'Free' : `$${price}`;
                                return `<div class="teneo-pricing-grid-row">
                                    <div class="teneo-pricing-grid-cell teneo-pricing-grid-cell--name">
                                        <span class="teneo-pricing-cmd-trigger">${cmd.trigger}</span>
                                        <span class="teneo-pricing-cmd-desc">${cmd.description || ''}</span>
                                    </div>
                                    <div class="teneo-pricing-grid-cell teneo-pricing-grid-cell--price">
                                        <span class="teneo-pricing-cmd-price">${priceDisplay}</span>
                                    </div>
                                    <div class="teneo-pricing-grid-cell teneo-pricing-grid-cell--unit">
                                        <span class="teneo-pricing-cmd-unit">${cmd.taskUnit || '—'}</span>
                                    </div>
                                </div>`;
                            }).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        renderCommandsTab() {
            const commands = this.agent.commands || [];
            const capabilities = this.agent.capabilities || [];

            return `
                <div class="teneo-detail-tab-content${this.activeTab === 'commands' ? ' active' : ''}" data-tab-content="commands">
                    <div class="teneo-detail-commands-section">
                        ${capabilities.length > 0 ? `
                            <div class="teneo-cc-group">
                                <div class="teneo-cc-group-title">Capabilities</div>
                                <div class="teneo-cc-pills">
                                    ${capabilities.map(cap => `
                                        <span class="teneo-cc-pill teneo-cc-pill--cap" title="${cap.description || ''}">${cap.name || ''}</span>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}

                        ${commands.length > 0 ? `
                            <div class="teneo-cc-group">
                                <div class="teneo-cc-group-title">Commands</div>
                                <div class="teneo-cc-pills">
                                    ${commands.map(cmd => `
                                        <span class="teneo-cc-pill teneo-cc-pill--cmd" title="${cmd.description || ''}">${cmd.trigger}</span>
                                    `).join('')}
                                </div>
                            </div>
                        ` : '<p style="color:#BAD3D8;">No commands available.</p>'}
                    </div>
                </div>
            `;
        }

        renderFAQTab() {
            const faqItems = this.agent.faq_items || [];
            if (faqItems.length === 0) return '';

            return `
                <div class="teneo-detail-tab-content${this.activeTab === 'faq' ? ' active' : ''}" data-tab-content="faq">
                    <div class="teneo-detail-faq-section">
                        <div class="teneo-detail-faq-list">
                            ${faqItems.map((item, i) => `
                                <div class="teneo-detail-faq-item" data-faq="${i}">
                                    <div class="teneo-detail-faq-question">
                                        <svg class="teneo-detail-faq-chevron" width="12" height="6" viewBox="0 0 12 6" fill="none"><path d="M1 1L6 5L11 1" stroke="#D3F372" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        <span>${item.question}</span>
                                    </div>
                                    <div class="teneo-detail-faq-answer">${item.answer}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        setupDetailEvents() {
            // Tab switching
            this.container.querySelectorAll('.teneo-detail-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    this.switchTab(tab.getAttribute('data-tab'));
                });
            });
            // FAQ accordion
            this.container.querySelectorAll('.teneo-detail-faq-question').forEach(q => {
                q.addEventListener('click', () => {
                    q.closest('.teneo-detail-faq-item').classList.toggle('open');
                });
            });
            // Copy explorer URL
            this.container.querySelectorAll('[data-copy-url]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const url = btn.getAttribute('data-copy-url');
                    navigator.clipboard.writeText(url).then(() => {
                        const orig = btn.innerHTML;
                        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#D3F372" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                        setTimeout(() => { btn.innerHTML = orig; }, 1500);
                    });
                });
            });
        }

        switchTab(tabId) {
            this.activeTab = tabId;
            this.container.querySelectorAll('.teneo-detail-tab').forEach(t => {
                t.classList.toggle('active', t.getAttribute('data-tab') === tabId);
            });
            this.container.querySelectorAll('.teneo-detail-tab-content').forEach(p => {
                p.classList.toggle('active', p.getAttribute('data-tab-content') === tabId);
            });
        }

        async loadDetailAvatar() {
            const imageInfo = this.convertIpfsUrl(this.agent.image_url);
            if (!imageInfo) return;
            const imgEl = document.getElementById('teneo-detail-avatar-img');
            const fallbackEl = document.getElementById('teneo-detail-avatar-fallback');
            if (!imgEl) return;
            try {
                await this.loadImageWithFallback(imageInfo, imgEl);
                imgEl.style.display = 'block';
                if (fallbackEl) fallbackEl.style.display = 'none';
            } catch (e) {
                imgEl.style.display = 'none';
                if (fallbackEl) fallbackEl.style.display = 'flex';
            }
        }

        getChatLink() {
            return { url: 'https://developer.chatroom.teneo-protocol.ai/chatroom', sameTab: false };
        }

        getInitials(name) {
            if (!name) return '?';
            return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        }

        formatNumber(num) {
            if (num === undefined || num === null) return '0';
            if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
            return num.toString();
        }

        getExplorerUrl(network) {
            return (WIDGET_CONFIG.explorerUrls || {})[network.toLowerCase()] || '#';
        }

        convertIpfsUrl(ipfsUrl) {
            if (!ipfsUrl) return null;
            if (!ipfsUrl.startsWith('http://') && !ipfsUrl.startsWith('https://') && !ipfsUrl.startsWith('ipfs://')) return null;
            if (ipfsUrl.startsWith('ipfs://')) {
                const hash = ipfsUrl.replace('ipfs://', '').split('/')[0];
                if (!hash) return null;
                return {
                    gateways: [
                        `https://gateway.pinata.cloud/ipfs/${hash}`,
                        `https://ipfs.io/ipfs/${hash}`,
                        `https://4everland.io/ipfs/${hash}`
                    ],
                    isIpfs: true
                };
            }
            return { url: ipfsUrl, isIpfs: false };
        }

        async loadImageWithFallback(imageInfo, imgElement) {
            if (!imageInfo || !imgElement) throw new Error('Invalid');
            if (!imageInfo.isIpfs) {
                if (!imageInfo.url || (!imageInfo.url.startsWith('http://') && !imageInfo.url.startsWith('https://'))) throw new Error('Invalid URL');
                return new Promise((resolve, reject) => {
                    const t = new Image();
                    const to = setTimeout(() => reject(new Error('Timeout')), 5000);
                    t.onload = () => { clearTimeout(to); imgElement.src = imageInfo.url; resolve(); };
                    t.onerror = () => { clearTimeout(to); reject(new Error('Failed')); };
                    t.src = imageInfo.url;
                });
            }
            for (const gw of imageInfo.gateways) {
                try {
                    await new Promise((resolve, reject) => {
                        const t = new Image();
                        const to = setTimeout(() => reject(new Error('Timeout')), 5000);
                        t.onload = () => { clearTimeout(to); imgElement.src = gw; resolve(); };
                        t.onerror = () => { clearTimeout(to); reject(new Error('Failed')); };
                        t.src = gw;
                    });
                    return;
                } catch (e) { continue; }
            }
            throw new Error('All gateways failed');
        }

        renderMarkdown(text) {
            if (!text) return '';
            let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
            html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
            html = html.replace(/^# (.+)$/gm, '<h2>$1</h2>');
            html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
            html = html.replace(/(^- .+$(\n- .+$)*)/gm, (match) => {
                const items = match.split('\n').map(line => `<li>${line.replace(/^- /, '')}</li>`).join('');
                return `<ul>${items}</ul>`;
            });
            html = html.split(/\n\n+/).map(block => {
                block = block.trim();
                if (!block) return '';
                if (block.startsWith('<h') || block.startsWith('<ul') || block.startsWith('<ol')) return block;
                return `<p>${block.replace(/\n/g, '<br>')}</p>`;
            }).join('');
            return html;
        }
    }

    // Auto-initialize when DOM is ready
    function initWidget() {
        const detailContainer = document.getElementById(WIDGET_CONFIG.detailContainerId);
        const listContainer = document.getElementById(WIDGET_CONFIG.containerId);
        const hasAgentParam = new URLSearchParams(window.location.search).has('agent');

        if (detailContainer) {
            window.teneoAgentDetail = new TeneoAgentDetail(detailContainer);
        } else if (listContainer && hasAgentParam) {
            // Same page: show detail view when ?agent= param is present
            listContainer.id = WIDGET_CONFIG.detailContainerId;
            window.teneoAgentDetail = new TeneoAgentDetail(listContainer);
        } else if (listContainer && !window.teneoWidget) {
            window.teneoWidget = new TeneoAgentsWidget(listContainer);
        }
    }

    // Initialize immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

    // Expose classes globally
    window.TeneoAgentsWidget = TeneoAgentsWidget;
    window.TeneoAgentDetail = TeneoAgentDetail;

    // Expose showManagePopup globally
    window.showManagePopup = function() {
        if (window.teneoWidget) {
            window.teneoWidget.showManagePopup();
        }
    };
})();