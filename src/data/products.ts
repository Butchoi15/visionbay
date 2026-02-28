import { Product } from '../context/CartContext';

export const products: Product[] = [
  {
    id: 'cctv-1',
    name: 'ProVision 4K Ultra HD Security Camera System',
    price: 499.99,
    originalPrice: 599.99,
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'CCTV Systems',
    description: 'Protect your home with this state-of-the-art 4K Ultra HD security camera system. Features 4 cameras with night vision, motion detection, and a 2TB NVR.',
    condition: 'New',
    features: [
      '4K Ultra HD Resolution',
      'Color Night Vision up to 100ft',
      'Smart Motion Detection',
      '2TB Pre-installed HDD',
      'Weatherproof IP67 Rating'
    ],
    colors: ['White', 'Black'],
    storage: ['2TB', '4TB']
  },
  {
    id: 'cam-1',
    name: 'Smart Dome IP Camera 1080p',
    price: 89.99,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1555861496-0666c8981751?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'IP Cameras',
    description: 'A versatile indoor/outdoor dome camera with pan-tilt-zoom capabilities and two-way audio.',
    condition: 'New',
    features: [
      '1080p Full HD Video',
      '360° Pan & Tilt',
      'Two-Way Audio',
      'Cloud & Local Storage Options',
      'AI Human Detection'
    ],
    colors: ['White']
  },
  {
    id: 'cam-2',
    name: 'Outdoor Bullet Camera with Spotlight',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'IP Cameras',
    description: 'Deter intruders with a built-in spotlight and siren. This bullet camera offers crisp 2K resolution.',
    condition: 'New',
    features: [
      '2K QHD Resolution',
      'Active Deterrence (Spotlight & Siren)',
      'Color Night Vision',
      'Two-Way Talk',
      'IP65 Weather Resistant'
    ],
    colors: ['White', 'Black']
  },
  {
    id: 'rec-1',
    name: '8-Channel 4K PoE NVR',
    price: 249.99,
    originalPrice: 299.99,
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'NVR/DVR Recorders',
    description: 'Expandable network video recorder supporting up to 8 PoE cameras with 4K recording capabilities.',
    condition: 'New',
    features: [
      'Supports up to 8 PoE Cameras',
      '4K Recording Resolution',
      'H.265+ Video Compression',
      'Remote Viewing via App',
      'No HDD Included'
    ],
    storage: ['No HDD', '2TB', '4TB', '8TB']
  },
  {
    id: 'alarm-1',
    name: 'Wireless Smart Home Alarm Kit',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Smart Alarms',
    description: 'Complete wireless alarm system including base station, keypad, contact sensors, and motion detector.',
    condition: 'New',
    features: [
      'Easy DIY Installation',
      'Cellular & Wi-Fi Backup',
      '24/7 Professional Monitoring Optional',
      'Smartphone Control',
      'Pet-Friendly Motion Sensors'
    ]
  },
  {
    id: 'acc-1',
    name: '100ft Cat6 Ethernet Cable',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Accessories',
    description: 'High-speed Cat6 ethernet cable for reliable PoE camera connections.',
    condition: 'New',
    features: [
      '100ft Length',
      'Cat6 Standard',
      'Snagless RJ45 Connectors',
      'Weatherproof Outer Jacket'
    ],
    colors: ['Blue', 'White', 'Black']
  },
  {
    id: 'AMX-325LR3VSPF28D',
    sku: 'AMX-325LR3VSPF28D',
    name: 'UNV-Uniview UNV 5MP Vandal-resistant Network IR Fixed Dome Camera',
    price: 130,
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQa7euVILhfcaFnLpdp5x6NKRMQwenK2a9f4poIhYkuBx7p023_ZQhgRinpvzeSKskuUioOqYQxbaVxXZzBG3tgGfniwR0wNQByR6WnKimPFdZnXW6m0G91IEI',
    category: 'IP Cameras',
    description: `The WEC UNV 5MP Vandal-resistant Network IR Fixed Dome Camera is a high-quality security camera designed for outdoor use. It features a 5-megapixel sensor and a fixed lens with a focal length of 2.8mm, providing a wide-angle view of the area under surveillance.\n\nThe camera features built-in infrared illumination with a range of up to 30m (98ft), ensuring clear and detailed images even in complete darkness. The camera's true WDR technology allows it to capture clear images in strong light scenes, reducing overexposure and underexposure.\n\nThis camera is vandal-resistant with an IK10 rating, meaning it can withstand impact and is resistant to damage from vandalism. It is also weather-resistant with an IP67 rating, making it suitable for use in harsh outdoor environments.\n\nThe camera supports multiple video compression formats, including Ultra 265, H.265, H.264, and MJPEG, allowing you to choose the most suitable format for your application based on factors such as storage capacity and network bandwidth.\n\nThe camera supports PoE power supply, making it easy to install and connect to your network. It also has a built-in Micro SD or TF card slot that supports cards up to 256GB, allowing you to store footage locally.\n\nOverall, the WEC-UNV 5MP Vandal-resistant Network IR Fixed Dome Camera is an excellent choice for anyone looking for a high-quality security camera that is rugged, weather-resistant, and capable of delivering clear and detailed images in a variety of lighting conditions. Its vandal-resistant design ensures reliable performance even in harsh outdoor environments, while its built-in infrared illumination and true WDR technology provide clear images in a wide range of lighting conditions.`,
    condition: 'New',
    features: [
      'Day/night functionality',
      'Smart IR, up to 30 m (98 ft) IR distance',
      '2D/3D DNR (Digital Noise Reduction)',
      'Ultra 265,H.265,H.264,MJPEG',
      'ROI (Region of Interest)',
      'Intrusion Detection',
      'ONVIF Conformance',
      'Support PoE power supply',
      'Wide temperature range: -30°C to 60°C (-22°F to 140°F)',
      'Wide voltage range of ±25%',
      'IK10 vandal resistant',
      'IP67',
      '2-Axis'
    ]
  },
  {
    id: 'WEC-IPC-B124-APF28',
    sku: 'WEC-IPC-B124-APF28',
    name: 'Uniview 4MP Mini Fixed Lens NDAA-Compliant Network Camera',
    price: 153,
    image: 'https://www.worldeyecam.com/images/product/P/IPC-B124-APF28.PNG',
    category: 'IP Cameras',
    description: 'Uniview 4MP Mini Fixed Lens NDAA-Compliant Network Camera',
    condition: 'New',
    features: [
      'Day/night functionality',
      'Smart IR, up to 30m (98ft) IR distance',
      'Optical glass window with higher light transmittance',
      'IR anti-reflection window to increase the infrared transmittance',
      '2D/3D DNR (Digital Noise Reduction)',
      'Built-in Mic',
      'Ultra 265, H.265, H.264, MJPEG',
      'ROI (Region of Interest)',
      'ONVIF Conformance',
      'Wide temperature range: -30°C ~ 60°C (-22°F ~ 140°F)',
      'Wide voltage range of ±25%',
      'IP67'
    ]
  },
  {
    id: 'WEC-IPC-T124-APF28',
    sku: 'WEC-IPC-T124-APF28',
    name: 'Uniview 1440p 4MP NDAA-Compliant Weatherproof Turret IP Security Camera with a 2.8mm Fixed Lens and a Built-In Microphone',
    price: 153,
    image: 'https://nellyssecurity.com/cdn/shop/files/ipc-t124-apf28-front.jpg?v=1707496760&width=550',
    category: 'IP Cameras',
    description: 'Uniview 1440p 4MP NDAA-Compliant Weatherproof Turret IP Security Camera with a 2.8mm Fixed Lens and a Built-In Microphone',
    condition: 'New',
    features: [
      'Day/night functionality',
      'Smart IR, up to 30m (98ft) IR distance',
      '2D/3D DNR (Digital Noise Reduction)',
      'Built-in Mic',
      'IP67 weatherproof rating',
      '3-Axis angle adjustment'
    ]
  },
  {
    id: 'AMX-354SR3ADNPF28F',
    sku: 'AMX-354SR3ADNPF28F',
    name: 'UNV-Uniview UNV 4MP Cable-free WDR IR Fixed 2.8 Dome Security Camera',
    price: 170,
    image: 'https://enssecurity.com/wp-content/uploads/2021/10/u_n_un-ipc354sr3adnpf28f-uniview-security-cameras-min.jpg',
    category: 'IP Cameras',
    description: `The WEC-UNV 4MP Cable-free WDR IR Fixed 2.8 Dome Security Camera is a high-resolution network camera designed for indoor surveillance applications. It features a 4-megapixel resolution, which provides high-quality images and video footage with clear details. The camera also has a fixed lens with a 2.8mm focal length, which provides a wide viewing angle of up to 106 degrees.\n\nThe camera features advanced image processing technology such as WDR (Wide Dynamic Range) and 3D DNR (Digital Noise Reduction), which help to improve the clarity of the footage in challenging lighting conditions. It also has infrared night vision capabilities, allowing it to capture clear images up to 98 feet away in complete darkness.\n\nThe camera can be accessed remotely via a mobile app or web browser, allowing you to view your camera feeds from anywhere with an internet connection. Overall, the WEC-UNV 4MP Cable-free WDR IR Fixed 2.8 Dome Security Camera is a reliable and effective solution for indoor surveillance applications, providing high-quality images and advanced features for efficient monitoring.`,
    condition: 'New',
    features: [
      'Day/night functionality',
      'Smart IR, up to 30m (98ft) IR distance',
      'Up to 120 dB WDR (Wide Dynamic Range)',
      '2D/3D DNR (Digital Noise Reduction)',
      'Wavelength: 850nm',
      'Ultra 265, H.265, H.264, MJPEG',
      'ROI (Region of Interest)',
      'Customized OSD',
      'ONVIF Conformance',
      'Built-in Mic',
      'Micro SD, up to 128GB',
      'Wide temperature range: -35°C ~ 60°C (-31°F ~ 140°F)',
      'Wide input voltage range of ±25%',
      '3-Axis'
    ]
  },
  {
    id: 'WEC-UN-IPC3614SR3-ADF28K-G',
    sku: 'WEC-UN-IPC3614SR3-ADF28K-G',
    name: 'Fixed Network Security Camera WEC-UN-IPC3614SR3-ADF28K-G',
    price: 180,
    image: 'https://www.worldeyecam.com/images/product/P/02-02.jpg',
    category: 'IP Cameras',
    description: `Uniview UNV 4MP Eyeball Network Security Camera Features High-quality image with 4MP, 1/3 CMOS sensor 4MP (2688*1520)@ 30/25fps; 4MP (2560*1440)@ 30/25fps; 3MP (2304*1296) @30/25fps; 2MP (1920*1080) @30/25fps; Ultra 265, H.265, H.264, MJPEG Easystar technology ensures high image quality in a low illumination environment True WDR technology of 120dB allows for a clean image in low-light situations. 9:16 Corridor Mode is supported. Built-in Microphone Smart IR with a range of up to 30m (98ft) infrared distance Micro SD or TF card up to 256 GB is supported. IP67 protection Support Power over Ethernet (PoE) power supply 3-Axis This Uniview UNV 4MP Eyeball Network Security Camera works with: UNV Networking Video Recorder ( NVR)`,
    condition: 'New',
    features: [
      'High-quality image with 4MP, 1/3 CMOS sensor',
      'Ultra 265, H.265, H.264, MJPEG',
      'Easystar technology',
      'True WDR technology of 120dB',
      '9:16 Corridor Mode is supported',
      'Built-in Microphone',
      'Smart IR with a range of up to 30m (98ft)',
      'Micro SD or TF card up to 256 GB',
      'IP67 protection',
      'Support PoE',
      '3-Axis'
    ]
  },
  {
    id: '2GIG-DREC2-319',
    sku: '2GIG-DREC2-319',
    name: '2GIG DREC2-319 GC2/GC2e Dual Receiver for 319MHz and 345MHz Sensors',
    price: 84.99,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTzrfonky7MY1g3vaIz-manN8IAgomHHJJRA&s',
    category: 'Accessories',
    description: `The 2GIG 319/345 MHz Receiver is designed to be installed into the 2GIG GC2 Panel. This Receiver is a dual frequency device, enabling communication between the Control Panel and peripheral devices that use either the 319 or the 345 MHz frequency.`,
    condition: 'New',
    features: [
      'InterLogix-compatible 319MHz wireless protocol',
      'Integrated into panel, no external power supply or translator hardware',
      'Easy to install into any GC2 panel',
      'Accepts up to 48 wireless devices using 2GIG, Honeywell, or InterLogix protocols',
      'External antenna provides reliable range performance'
    ]
  },
  {
    id: 'WEC-NVR30108S3',
    sku: 'WEC-NVR30108S3',
    name: 'UNV NVR301-08S3, 8-ch, 1 SATA interface',
    price: 179,
    image: 'https://enssecurity.com/wp-content/uploads/2023/07/UN-NVR301-08X-P8-v2-700x700.jpg',
    category: 'NVR/DVR Recorders',
    description: `The Uniview NVR-8 channels 1x HDD Easy, which is an 8-channel network video recorder designed for use with IP cameras. The NVR supports H.265/H.264 video compression, which can reduce storage requirements while maintaining high-quality video recordings.\n\nThe NVR has 8 PoE ports that support IEEE 802.3af/at, allowing for easy installation and setup of IP cameras without requiring separate power supplies. The NVR also supports ONVIF protocol, which enables integration with other ONVIF-compliant devices from different manufacturers.\n\nThe NVR-8 channels 1x HDD Easy offers various intelligent video analysis functions, such as intrusion detection, line crossing detection, and face detection, which can be used to trigger alarms and notifications when certain events occur. The NVR also supports real-time video monitoring and playback, making it suitable for use in security and surveillance applications.\n\nThe NVR has a single SATA port that supports up to 6TB hard drive, which can be used for video storage. The NVR also offers external backup options via USB or network storage, and remote access via web browser, smartphone app, or PC software.\n\nOther features of the NVR include two-way audio communication, HDMI and VGA video outputs, and a compact design with dimensions of 315mm x 240mm x 48mm. The NVR can be powered using a DC 48V power supply.`,
    condition: 'New',
    features: [
      'Max. recording resolution: 8MP',
      'HDMI interface (resolution) [pixels]: 3840 x 2160',
      'Audio: Yes',
      'Number of supported IP cameras: 8',
      'Number of supported HDD: 1 (up to 6TB)',
      'Video compression: H.264, H.265',
      'Camera class: Easy'
    ]
  },
  {
    id: 'WEC-NVR301-04E2',
    sku: 'WEC-NVR301-04E2',
    name: 'NVR for IP cameras Easy range 4 CH video / Ultra Compression 265 4 PoE Channels Maximum resolution 8 Mpx Supports 1 hard disk',
    price: 179,
    image: 'https://www.orbitadigital.com/317413-large_default/uniview-easy-uv-nvr301-04s3-p4-nvr-for-ip-cameras-easy-range-4-ch-video-ultra.jpg',
    category: 'NVR/DVR Recorders',
    description: `The WEC-NVR301-04E2 is a Network Video Recorder (NVR) designed for IP cameras. It can support up to 4 IP cameras with a maximum resolution of 8 megapixels each. The NVR comes with one hard disk bay for local storage of video footage, allowing for easy access and retrieval of video footage.\n\nThe NVR supports H.264 and H.265 video compression formats, which provide efficient storage and playback of video footage. It also has a built-in Ethernet port for network connectivity and supports remote access through web browsers or mobile applications.\n\nThe NVR has a user-friendly interface that allows for easy configuration and management of the NVR and connected IP cameras. It supports multiple advanced features such as motion detection and email alerts, which provide real-time notifications when motion is detected in the monitored area.\n\nIn addition, the NVR supports smart search and playback, which allows for quick and easy access to specific video footage. The NVR also has HDMI and VGA outputs for the local display of video footage.\n\nOverall, the WEC-NVR301-04E2 is a compact and user-friendly NVR designed for small-scale IP camera surveillance systems. Its support for advanced features such as motion detection and email alerts, smart search and playback, and remote access capabilities make it a convenient and efficient option for surveillance systems that require remote monitoring.`,
    condition: 'New',
    features: [
      'Inputs for IP cameras: up to 4 channels',
      'Power over Ethernet: Switch from 4 PoE ports IEEE802.3at',
      'IP compatible cameras: UNIVIEW, ONVIF',
      'Video compression format: Ultra 265 / H.265 / H.264',
      'Display resolution: up to 3840x2160',
      'Total bandwidth: 80 Mbps downstream / 64 Mbps upstream',
      'Intelligent functions: People Counting, Face Detection, Intrusion Detection, Line Crossing, etc.',
      'Internal memory: 1 SATA HDD 3.5" of up to 6 TB'
    ]
  },
  {
    id: 'WEC-NVR301-04S2-P4',
    sku: 'WEC-NVR301-04S2-P4',
    name: 'Uniview 4 Channel NVR, IP Network Video Recorder With PoE',
    price: 199,
    image: 'https://www.worldeyecam.com/images/product/P/NVR301-04S2-P4.png',
    category: 'NVR/DVR Recorders',
    description: `The WEC-NVR301-04S2-P4 is a 4-channel Network Video Recorder (NVR) designed for IP cameras. It features built-in Power over Ethernet (PoE) ports, which allow for easy installation and setup of PoE cameras without the need for additional power sources or cables.\n\nThe NVR supports H.265/H.264 video compression formats, which provide efficient storage and playback of video footage. It has a maximum recording resolution of 8MP and supports up to 4 IP cameras, each with a maximum resolution of 8MP. It also supports Ultra 265 compression technology, which further reduces bandwidth and storage requirements while maintaining high-quality video footage.\n\nThe NVR has a user-friendly interface that allows for easy configuration and management of the NVR and connected IP cameras. It supports advanced features such as motion detection, email alerts, and 24/7 recording, providing real-time notifications when motion is detected in the monitored area.\n\nIn addition, the NVR supports remote access through web browsers or mobile applications, allowing users to access and monitor their surveillance systems from anywhere with an internet connection. The NVR also has HDMI and VGA outputs for local display of video footage.\n\nOverall, the WEC-NVR301-04S2-P4 is a compact and reliable NVR designed for small to medium-scale IP camera surveillance systems. Its support for PoE cameras, advanced features, and remote access capabilities make it a convenient and efficient option for surveillance systems that require remote monitoring.`,
    condition: 'New',
    features: [
      '4 Channel Operation',
      'Supports 3rd Party Cameras',
      'Up to 6MP Resolution',
      'Built In POE'
    ]
  },
  {
    id: 'WEC-NVR301-04LS3-P4',
    sku: 'WEC-NVR301-04LS3-P4',
    name: '4-ch 1-SATA Ultra 265/H.265/H.264 NVR',
    price: 239,
    image: 'https://www.worldeyecam.com/var/images/product/400.400/P/NVR301-04LS3-P4.png',
    category: 'NVR/DVR Recorders',
    description: '4-ch 1-SATA Ultra 265/H.265/H.264 NVR',
    condition: 'New',
    features: [
      '4-channel input',
      'Ultra 265/H.265/H.264 video formats',
      '1 SATA interface'
    ]
  }
];
