(function() {
    'use strict';
    
    // Widget configuration
    const WIDGET_CONFIG = {
        apiUrl: 'https://backend.developer.chatroom.teneo-protocol.ai/api/public/agents',
        containerId: 'teneo-agents-widget',
        maxAgents: 12,
        showSearch: true,
        showPopularSection: true,
        adminApiUrl: null,
        popularAgentIds: [
            'instagram',
            'google-maps',
            'x-agent-enterprise-v2',
            'tiktok',
            'amazon',
            'youtube-agent-new'
        ]
    };

    // CSS styles matching exact Figma specifications
    const widgetCSS = `
        .teneo-widget-container {
            font-family: 'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: #ffffff;
            background: transparent;
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
            overflow-x: auto;
        }

        /* Search Bar */
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
        }

        .teneo-widget-search-icon::before {
            content: '';
            position: absolute;
            width: 10px;
            height: 10px;
            border: 1.5px solid #9EB5BC;
            border-radius: 50%;
            top: 1px;
            left: 1px;
        }

        .teneo-widget-search-icon::after {
            content: '';
            position: absolute;
            width: 5px;
            height: 1.5px;
            background: #9EB5BC;
            transform: rotate(45deg);
            bottom: 2px;
            right: 1px;
        }

        .teneo-widget-search-input {
            width: 100%;
            height: 26px;
            font-family: 'PP Neue Montreal';
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
            font-size: 3rem;
            font-weight: 600;
            color: #f3f4f6;
            margin-bottom: 2rem;
            text-align: center;
        }

        /* Grid Container - Frame 1261156334 */
        .teneo-widget-grid {
            display: grid;
            grid-template-columns: repeat(3, 424px);
            gap: 26px;
            width: 1326px;
            height: auto;
            justify-content: center;
            align-items: start;
            margin: 0 auto;
        }

        /* Agent Card - Frame 1261156182 */
        .teneo-widget-card {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 28.4322px;
            gap: 11.85px;
            width: 424px;
            height: 293.25px;
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
            justify-content: center;
            align-items: flex-start;
            padding: 0px;
            gap: 20.14px;
            width: 367.14px;
            height: 236.38px;
            flex: none;
            align-self: stretch;
            flex-grow: 0;
        }

        /* Top Section - Frame 1261156188 */
        .teneo-widget-card-top {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 0px;
            gap: 17.77px;
            width: 367.14px;
            height: 187.81px;
            flex: none;
            align-self: stretch;
            flex-grow: 0;
        }

        /* Header Row - Frame 1261156308 */
        .teneo-widget-header-card {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0px;
            gap: 58.05px;
            width: 367.14px;
            height: 50.04px;
            flex: none;
            align-self: stretch;
            flex-grow: 0;
        }

        /* Avatar Section - Frame 1261156187 */
        .teneo-widget-avatar-section {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0px;
            gap: 10.66px;
            width: 200.21px;
            height: 50.04px;
            flex: none;
            flex-grow: 0;
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
            font-family: 'PP Neue Montreal';
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
            gap: 2.37px;
            width: 139.79px;
            height: 45.02px;
            flex: none;
            flex-grow: 0;
        }

        /* Agent Name Container - Frame 1261156183 */
        .teneo-widget-name-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 0px;
            width: 117.28px;
            height: 23.69px;
            flex: none;
            flex-grow: 0;
        }

        /* Agent X */
        .teneo-widget-name {
            width: 117.28px;
            height: 23.69px;
            font-family: 'PP Neue Montreal';
            font-style: normal;
            font-weight: 500;
            font-size: 20px;
            line-height: 180%;
            display: flex;
            align-items: center;
            color: #BAD3D8;
            flex: none;
            flex-grow: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Creator Container - Frame 1261156184 */
        .teneo-widget-creator-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 0px;
            width: 139.79px;
            height: 18.95px;
            flex: none;
            align-self: stretch;
            flex-grow: 0;
        }

        /* frolody-007-ai */
        .teneo-widget-creator {
            width: 83px;
            height: 25px;
            font-family: 'PP Neue Montreal';
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
            width: 62.69px;
        }

        .teneo-widget-status-text.offline {
            width: 61.69px;
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
            font-family: 'PP Neue Montreal';
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
            width: 39px;
        }

        .teneo-widget-status-text.offline .teneo-widget-status-label {
            width: 38px;
        }

        /* Description */
        .teneo-widget-description {
            width: 367.14px;
            height: 120px;
            font-family: 'PP Neue Montreal';
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 150%;
            display: flex;
            align-items: flex-start;
            color: #BAD3D8;
            flex: none;
            align-self: stretch;
            flex-grow: 0;
        }

        .teneo-widget-description p {
            margin: 0;
            width: 100%;
            display: -webkit-box;
            -webkit-line-clamp: 5;
            -webkit-box-orient: vertical;
            overflow: hidden;
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
            font-family: 'PP Neue Montreal';
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
            text-align: center;
            margin-top: 2rem;
        }

        .teneo-widget-load-more-btn {
            padding: 0.75rem 2rem;
            background: #374151;
            border: 1px solid #4b5563;
            border-radius: 8px;
            color: #d1d5db;
            font-weight: 500;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .teneo-widget-load-more-btn:hover {
            background: #4b5563;
            border-color: #6b7280;
        }

        /* Responsive */
        @media (max-width: 1400px) {
            .teneo-widget-grid {
                grid-template-columns: repeat(2, 424px);
                width: 874px;
            }
        }

        @media (max-width: 900px) {
            .teneo-widget-grid {
                grid-template-columns: 424px;
                width: 424px;
            }
        }

        @media (max-width: 468px) {
            .teneo-widget-grid {
                grid-template-columns: 1fr;
                width: 100%;
                padding: 0 20px;
            }
            
            .teneo-widget-card {
                width: 100%;
                max-width: 424px;
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
            border: 1.5px solid #9EB5BC;
            flex: none;
            order: 0;
            flex-grow: 0;
        }

        /* Search Input */
        .teneo-manage-popup-search-input {
            width: 135px;
            height: 16px;
            font-family: 'PP Neue Montreal';
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
            font-family: 'PP Neue Montreal';
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
            font-family: 'PP Neue Montreal';
            font-style: normal;
            font-weight: 400;
            font-size: 64px;
            line-height: 180%;
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
            font-family: 'PP Neue Montreal';
            font-style: normal;
            font-weight: 400;
            font-size: 64px;
            line-height: 180%;
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
            width: 385.02px;
            height: 59.23px;
            background: #25272B;
            flex: none;
            order: 5;
            flex-grow: 0;
            z-index: 5;
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
            border-radius: 5.92338px;
            flex: none;
            order: 0;
            flex-grow: 0;
            cursor: pointer;
            border: none;
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
            font-family: 'PP Neue Montreal';
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
                font-size: 48px;
            }
            
            .teneo-manage-popup-more-title {
                font-size: 48px;
            }
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
            
            this.init();
        }

        async init() {
            this.injectCSS();
            this.setupContainer();
            await this.loadConfiguration();
            await this.loadAgents();
            this.setupEventListeners();
        }

        injectCSS() {
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
                this.agents = data.agents || [];
                
                this.processAgents();
                this.renderAgents();
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
            const { popularAgents, remainingAgents } = this.getPopularAgents();
            
            // Render popular agents
            this.renderAgentGrid('popular-grid', popularAgents);
            
            // Render more agents from remaining agents
            const moreAgents = remainingAgents.slice(0, this.moreAgentsCount);
            this.renderAgentGrid('more-grid', moreAgents);
            
            const loadMoreBtn = document.getElementById('load-more');
            if (loadMoreBtn) {
                const hasMoreAgents = remainingAgents.length > this.moreAgentsCount;
                loadMoreBtn.style.display = hasMoreAgents ? 'block' : 'none';
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

        createAgentCard(agent) {
            const isOnline = agent.is_online;
            const imageInfo = this.convertIpfsUrl(agent.image_url);
            const cardId = `teneo-card-${agent.id}`;
            
            return `
                <div class="teneo-widget-card ${isOnline ? 'online' : 'offline'}" id="${cardId}">
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
                                            <div class="teneo-widget-creator">${agent.creator_name || this.formatAddress(agent.creator)}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="teneo-widget-status-text ${isOnline ? 'online' : 'offline'}">
                                    <div class="teneo-widget-status-dot"></div>
                                    <div class="teneo-widget-status-label">${isOnline ? 'Online' : 'Offline'}</div>
                                </div>
                            </div>
                            <div class="teneo-widget-description">
                                <p>${agent.description || 'No description available'}</p>
                            </div>
                        </div>
                        <div class="teneo-widget-actions">
                            <a href="https://chatroom.teneo-protocol.ai" target="_blank" class="teneo-widget-btn">
                                <div class="btn-text">Chat Now</div>
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
                imgElement.style.display = 'none';
                initialsElement.style.display = 'flex';
                this.imageLoadStatus.set(agent.id, false);
            }
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
            
            if (!searchTerm) {
                // No search term - show normal sections
                this.filteredAgents = [...this.agents];
                if (popularSection) popularSection.style.display = 'flex';
                if (moreSection) moreSection.style.display = 'flex';
                if (searchResultsSection) searchResultsSection.style.display = 'none';
                this.processAgents();
                this.renderAgents();
            } else {
                // Has search term - hide sections, show only search results
                this.filteredAgents = this.agents.filter(agent => {
                    const agentName = (agent.agent_name || '').toLowerCase();
                    const creatorName = (agent.creator_name || '').toLowerCase();
                    const description = (agent.description || '').toLowerCase();
                    
                    return agentName.includes(searchTerm) ||
                           creatorName.includes(searchTerm) ||
                           description.includes(searchTerm);
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
            
            if (ipfsUrl.startsWith('ipfs://')) {
                const hash = ipfsUrl.replace('ipfs://', '');
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
            if (!imageInfo.isIpfs) {
                // For non-IPFS URLs, verify the image loads before setting it
                return new Promise((resolve, reject) => {
                    const testImg = new Image();
                    const timeout = setTimeout(() => reject(new Error('Timeout')), 5000);
                    
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

    // Auto-initialize when DOM is ready
    function initWidget() {
        const container = document.getElementById(WIDGET_CONFIG.containerId);
        if (container && !window.teneoWidget) {
            window.teneoWidget = new TeneoAgentsWidget(container);
        }
    }

    // Initialize immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

    // Expose widget class globally for manual initialization
    window.TeneoAgentsWidget = TeneoAgentsWidget;
    
    // Expose showManagePopup globally
    window.showManagePopup = function() {
        if (window.teneoWidget) {
            window.teneoWidget.showManagePopup();
        }
    };
})();