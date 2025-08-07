class MedicalFacilityFinder {
    constructor() {
        this.currentLocation = null;
        this.currentFilter = 'internal'; // Changed default filter to 'internal'
        this.facilities = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateStatus('위치를 찾으려면 "내 위치 찾기" 버튼을 클릭하세요');
    }

    bindEvents() {
        document.getElementById('getLocationBtn').addEventListener('click', () => {
            this.getCurrentLocation();
        });

        document.querySelectorAll('.btn.filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.type);
            });
        });
    }

    setFilter(type) {
        this.currentFilter = type;

        // Update active button
        document.querySelectorAll('.btn.filter').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-type="${type}"]`).classList.add('active');

        if (this.currentLocation) {
            this.findNearbyFacilities();
        }
    }

    getCurrentLocation() {
        if (!navigator.geolocation) {
            this.updateStatus('이 브라우저는 위치 서비스를 지원하지 않습니다', 'error');
            return;
        }

        this.updateStatus('위치를 찾는 중...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                this.updateStatus(`위치를 찾았습니다! (${this.currentLocation.lat.toFixed(4)}, ${this.currentLocation.lng.toFixed(4)})`);
                this.updateMap();
                this.findNearbyFacilities();
            },
            (error) => {
                let message = '위치를 찾을 수 없습니다: ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        message += '위치 접근 권한이 거부되었습니다';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message += '위치 정보를 사용할 수 없습니다';
                        break;
                    case error.TIMEOUT:
                        message += '위치 요청 시간이 초과되었습니다';
                        break;
                    default:
                        message += '알 수 없는 오류가 발생했습니다';
                        break;
                }
                this.updateStatus(message, 'error');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    }

    updateMap() {
        const mapElement = document.getElementById('map');
        mapElement.innerHTML = `
            <div style="padding: 20px; text-align: center; background: #e8f5e8;">
                <h3>📍 현재 위치</h3>
                <p>위도: ${this.currentLocation.lat.toFixed(6)}</p>
                <p>경도: ${this.currentLocation.lng.toFixed(6)}</p>
                <p style="margin-top: 15px; color: #666;">
                    실제 서비스에서는 여기에 구글 지도 또는 네이버 지도가 표시됩니다
                </p>
            </div>
        `;
    }

    async findNearbyFacilities() {
        this.updateStatus(`주변 ${this.getFilterDisplayName()}을(를) 검색하는 중...`);

        // 실제 환경에서는 실제 API를 사용하지만, 여기서는 시뮬레이션 데이터를 사용합니다
        setTimeout(() => {
            this.facilities = this.generateSimulatedData();
            this.displayFacilities();
            this.updateStatus(`${this.facilities.length}개의 ${this.getFilterDisplayName()}을(를) 찾았습니다`);
        }, 1500);
    }

    getFilterDisplayName() {
        switch(this.currentFilter) {
            case 'internal': return '내과';
            case 'orthopedic': return '정형외과';
            case 'dental': return '치과';
            case 'ent': return '이비인후과';
            case 'ophthalmology': return '안과';
            case 'pediatric': return '소아과';
            case 'gynecology': return '산부인과';
            case 'dermatology': return '피부과';
            case 'neurology': return '신경과';
            case 'general_hospital': return '대형병원';
            case 'pharmacy': return '약국';
            default: return '병원';
        }
    }

    generateSimulatedData() {
        const facilityNames = {
            internal: ['튼튼내과', '맑은내과', '연세내과', '본내과', '희망내과', '건강내과', '서울내과', '중앙내과', '행복내과', '미래내과', '새로운내과', '좋은내과'],
            orthopedic: ['튼튼정형외과', '바른정형외과', '참정형외과', '본정형외과', '행복정형외과', '건강정형외과', '서울정형외과', '중앙정형외과', '미래정형외과', '새로운정형외과', '좋은정형외과', '우리정형외과'],
            dental: ['미소치과', '밝은치과', '연세치과', '튼튼치과', '스마일치과', '건강치과', '서울치과', '중앙치과', '행복치과', '미래치과', '새로운치과', '좋은치과'],
            ent: ['코앤귀이비인후과', '맑은이비인후과', '소리이비인후과', '편한이비인후과', '사랑이비인후과', '건강이비인후과', '서울이비인후과', '중앙이비인후과', '행복이비인후과', '미래이비인후과'],
            ophthalmology: ['밝은안과', '글로리아안과', '드림안과', '본안과', '연세안과', '건강안과', '서울안과', '중앙안과', '행복안과', '미래안과', '새로운안과', '좋은안과'],
            pediatric: ['아이사랑소아과', '꼬마소아과', '튼튼소아과', '행복소아과', '미소소아과', '건강소아과', '서울소아과', '중앙소아과', '미래소아과', '새로운소아과', '우리소아과', '좋은소아과'],
            gynecology: ['여성병원', '마더스산부인과', '행복산부인과', '사랑산부인과', '여성의원', '건강산부인과', '서울산부인과', '중앙산부인과', '미래산부인과', '새로운산부인과'],
            dermatology: ['깨끗한피부과', '아름다운피부과', '건강피부과', '맑은피부과', '청춘피부과', '서울피부과', '중앙피부과', '행복피부과', '미래피부과', '새로운피부과', '좋은피부과', '우리피부과'],
            neurology: ['브레인신경과', '건강신경과', '맑은신경과', '행복신경과', '튼튼신경과', '서울신경과', '중앙신경과', '미래신경과', '새로운신경과', '좋은신경과'],
            general_hospital: ['서울대학교병원', '삼성서울병원', '세브란스병원', '서울아산병원', '고려대학교병원', '한양대학교병원', '중앙대학교병원', '성균관대학교병원'],
            pharmacy: ['온누리약국', '참약국', '미소약국', '건강약국', '사랑약국', '서울약국', '중앙약국', '행복약국', '미래약국', '새로운약국', '좋은약국', '우리약국', '튼튼약국', '맑은약국']
        };

        const names = facilityNames[this.currentFilter] || facilityNames['internal']; // Default to internal if filter is not found
        const facilities = [];

        const maxFacilities = this.currentFilter === 'general_hospital' ? 6 : 10; // 대형병원은 6개, 나머지는 10개
        
        for (let i = 0; i < Math.min(maxFacilities, names.length); i++) {
            // 대형병원은 더 멀리, 일반 병원/약국은 가까이
            const distance = this.currentFilter === 'general_hospital' 
                ? Math.random() * 8000 + 1000  // 1km ~ 9km for large hospitals
                : Math.random() * 1500 + 50;   // 50m ~ 1.5km for smaller clinics
            const bearing = Math.random() * 360; // direction

            facilities.push({
                name: names[i],
                address: `서울시 ${['강남구', '서초구', '송파구', '마포구', '용산구', '중구', '종로구'][Math.floor(Math.random() * 7)]} ${Math.floor(Math.random() * 999) + 1}번지`,
                distance: Math.round(distance),
                type: this.currentFilter,
                phone: '02-' + Math.floor(Math.random() * 9000 + 1000) + '-' + Math.floor(Math.random() * 9000 + 1000),
                lat: this.currentLocation.lat + (Math.cos(bearing * Math.PI / 180) * distance / 111000),
                lng: this.currentLocation.lng + (Math.sin(bearing * Math.PI / 180) * distance / (111000 * Math.cos(this.currentLocation.lat * Math.PI / 180)))
            });
        }

        return facilities.sort((a, b) => a.distance - b.distance);
    }

    displayFacilities() {
        const container = document.getElementById('facilityItems');

        if (this.facilities.length === 0) {
            container.innerHTML = '<p class="loading">주변에 시설이 없습니다.</p>';
            return;
        }

        container.innerHTML = this.facilities.map(facility => `
            <div class="facility-item ${facility.type}">
                <div class="facility-name">
                    ${this.getFacilityIcon(facility.type)} ${facility.name}
                </div>
                <div class="facility-address">📍 ${facility.address}</div>
                <div class="facility-distance">📏 거리: ${facility.distance}m</div>
                <div class="facility-actions">
                    <button class="btn-small btn-directions" onclick="medicalFinder.getDirections('${facility.name}', ${facility.lat}, ${facility.lng})">
                        🗺️ 길찾기
                    </button>
                    <button class="btn-small btn-call" onclick="medicalFinder.callFacility('${facility.phone}')">
                        📞 전화하기
                    </button>
                </div>
            </div>
        `).join('');
    }

    getFacilityIcon(type) {
        switch(type) {
            case 'internal': return '🩺';
            case 'orthopedic': return '🦴';
            case 'dental': return '🦷';
            case 'ent': return '👂';
            case 'ophthalmology': return '👁️';
            case 'pediatric': return '👶';
            case 'gynecology': return '👩‍⚕️';
            case 'dermatology': return '🧴';
            case 'neurology': return '🧠';
            case 'general_hospital': return '🏥';
            case 'pharmacy': return '💊';
            default: return '🏥';
        }
    }

    getDirections(name, lat, lng) {
        if (!this.currentLocation) {
            alert('현재 위치를 먼저 찾아주세요');
            return;
        }

        const googleMapsUrl = `https://www.google.com/maps/dir/${this.currentLocation.lat},${this.currentLocation.lng}/${lat},${lng}`;
        const naverMapsUrl = `https://map.naver.com/v5/directions/${this.currentLocation.lng},${this.currentLocation.lat}/${lng},${lat}/car`;

        const choice = confirm(`${name}까지의 길찾기를 시작합니다.\n\n확인: 구글 지도로 이동\n취소: 네이버 지도로 이동`);

        if (choice) {
            window.open(googleMapsUrl, '_blank');
        } else {
            window.open(naverMapsUrl, '_blank');
        }
    }

    callFacility(phone) {
        if (confirm(`${phone}로 전화하시겠습니까?`)) {
            window.open(`tel:${phone}`);
        }
    }

    updateStatus(message, type = '') {
        const statusElement = document.getElementById('status');
        statusElement.textContent = message;
        statusElement.className = `status ${type}`;
    }
}

// 앱 초기화
const medicalFinder = new MedicalFacilityFinder();

// 페이지 로드 완료 시 웰컴 메시지
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏥 병원 & 약국 찾기 앱이 로드되었습니다');
    console.log('📍 위치 권한을 허용하고 "내 위치 찾기"를 클릭하세요');
});