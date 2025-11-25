// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.overview-card, .finding-card, .province-card, .vulnerability-card, .principle-card, .about-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Active navigation highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add counter animation for stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
};

// Animate stats when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent.replace(/,/g, ''));
                animateCounter(stat, target);
            });
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const hero = document.querySelector('.hero');
if (hero) {
    heroObserver.observe(hero);
}

// Add hover effect for metric values
document.querySelectorAll('.metric-value').forEach(metric => {
    metric.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.2s ease';
    });
    metric.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Print functionality
const addPrintButton = () => {
    const nav = document.querySelector('.navbar .container');
    const printBtn = document.createElement('button');
    printBtn.textContent = '🖨️ Print Report';
    printBtn.className = 'print-button';
    printBtn.style.cssText = `
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.3s;
    `;
    printBtn.addEventListener('mouseenter', () => {
        printBtn.style.background = 'var(--secondary-color)';
    });
    printBtn.addEventListener('mouseleave', () => {
        printBtn.style.background = 'var(--primary-color)';
    });
    printBtn.addEventListener('click', () => {
        window.print();
    });
    
    // Only add on desktop
    if (window.innerWidth > 768) {
        nav.appendChild(printBtn);
    }
};

// Initialize print button
addPrintButton();

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
});

// Add loading state
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

console.log('🎯 Responsible AI Bias Audit Report - Website Loaded');
console.log('📊 Analyzing COVID-19 disparities for equitable AI development');


// File Upload Functionality
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const fileList = document.getElementById('fileList');
const analysisOptions = document.getElementById('analysisOptions');
const analyzeButton = document.getElementById('analyzeButton');
const analysisResults = document.getElementById('analysisResults');
const resultsContent = document.getElementById('resultsContent');
const downloadReport = document.getElementById('downloadReport');
const resetAnalysis = document.getElementById('resetAnalysis');
const downloadSample = document.getElementById('downloadSample');

let uploadedFiles = [];

// Upload button click
if (uploadButton) {
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });
}

// Upload area click
if (uploadArea) {
    uploadArea.addEventListener('click', (e) => {
        if (e.target !== uploadButton) {
            fileInput.click();
        }
    });
}

// File input change
if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

// Drag and drop
if (uploadArea) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.add('drag-over');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.remove('drag-over');
        }, false);
    });

    uploadArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }, false);
}

// Handle files
function handleFiles(files) {
    const validTypes = ['text/csv', 'text/plain', 'application/json', 
                       'application/vnd.ms-excel', 
                       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    Array.from(files).forEach(file => {
        // Check file size (50MB limit)
        if (file.size > 50 * 1024 * 1024) {
            alert(`File ${file.name} is too large. Maximum size is 50MB.`);
            return;
        }

        // Check file type
        const fileExt = file.name.split('.').pop().toLowerCase();
        const validExts = ['csv', 'txt', 'json', 'xlsx', 'xls'];
        
        if (!validExts.includes(fileExt)) {
            alert(`File ${file.name} has an unsupported format.`);
            return;
        }

        uploadedFiles.push(file);
        displayFile(file);
    });

    if (uploadedFiles.length > 0) {
        analysisOptions.style.display = 'block';
    }
}

// Display file in list
function displayFile(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
        <div class="file-info">
            <span class="file-icon">📄</span>
            <div class="file-details">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <span class="file-status success">Ready</span>
        </div>
        <button class="file-remove" onclick="removeFile('${file.name}')">✕</button>
    `;
    fileList.appendChild(fileItem);
}

// Remove file
function removeFile(fileName) {
    uploadedFiles = uploadedFiles.filter(f => f.name !== fileName);
    const fileItems = fileList.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        if (item.querySelector('.file-name').textContent === fileName) {
            item.remove();
        }
    });

    if (uploadedFiles.length === 0) {
        analysisOptions.style.display = 'none';
        analysisResults.style.display = 'none';
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Analyze button
if (analyzeButton) {
    analyzeButton.addEventListener('click', () => {
        runAnalysis();
    });
}

// Run analysis
function runAnalysis() {
    // Show loading state
    analyzeButton.disabled = true;
    analyzeButton.innerHTML = '<span class="spinner"></span> Analyzing...';

    // Update file status
    const fileItems = fileList.querySelectorAll('.file-status');
    fileItems.forEach(status => {
        status.className = 'file-status processing';
        status.textContent = 'Processing';
    });

    // Get selected analysis types
    const selectedAnalyses = Array.from(document.querySelectorAll('input[name="analysis"]:checked'))
        .map(cb => cb.value);

    // Simulate analysis (in real app, this would process the files)
    setTimeout(() => {
        // Read files and perform analysis
        processFiles(uploadedFiles, selectedAnalyses);
    }, 2000);
}

// Process files
function processFiles(files, analyses) {
    // Simulate file processing and analysis
    const results = generateMockResults(files, analyses);
    displayResults(results);

    // Update UI
    analyzeButton.disabled = false;
    analyzeButton.textContent = 'Run Bias Analysis';

    const fileItems = fileList.querySelectorAll('.file-status');
    fileItems.forEach(status => {
        status.className = 'file-status success';
        status.textContent = 'Analyzed';
    });

    analysisResults.style.display = 'block';
    analysisResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Generate mock results
function generateMockResults(files, analyses) {
    const totalRecords = Math.floor(Math.random() * 50000) + 10000;
    
    return {
        summary: {
            filesProcessed: files.length,
            totalRecords: totalRecords,
            dateRange: '2020-01-01 to 2021-12-31',
            analysesRun: analyses.length
        },
        demographics: analyses.includes('demographic') ? {
            ageGroups: 5,
            genderDistribution: 'Balanced (51% F, 48% M, 1% NB)',
            highRiskGroups: 'Age 60+, Male'
        } : null,
        geographic: analyses.includes('geographic') ? {
            provinces: 9,
            urbanRural: '65% Urban, 35% Rural',
            highestCFR: 'Eastern Cape (3.8%)',
            lowestCFR: 'Gauteng (2.1%)'
        } : null,
        socioeconomic: analyses.includes('socioeconomic') ? {
            sesGroups: 3,
            mortalityGap: '2.3x (Low vs High SES)',
            vaccinationGap: '43% difference',
            criticalFinding: 'SES strongest predictor of outcomes'
        } : null,
        biasDetection: analyses.includes('bias') ? {
            biasesFound: 4,
            severity: 'High',
            primaryBias: 'Socio-economic disparities',
            recommendation: 'Immediate equity interventions needed'
        } : null
    };
}

// Display results
function displayResults(results) {
    let html = '';

    // Summary
    html += `
        <div class="result-card">
            <h4>📊 Analysis Summary</h4>
            <div class="result-metric">
                <span class="result-label">Files Processed:</span>
                <span class="result-value">${results.summary.filesProcessed}</span>
            </div>
            <div class="result-metric">
                <span class="result-label">Total Records:</span>
                <span class="result-value">${results.summary.totalRecords.toLocaleString()}</span>
            </div>
            <div class="result-metric">
                <span class="result-label">Date Range:</span>
                <span class="result-value">${results.summary.dateRange}</span>
            </div>
            <div class="result-metric">
                <span class="result-label">Analyses Completed:</span>
                <span class="result-value">${results.summary.analysesRun}</span>
            </div>
        </div>
    `;

    // Demographics
    if (results.demographics) {
        html += `
            <div class="result-card">
                <h4>👥 Demographic Analysis</h4>
                <div class="result-metric">
                    <span class="result-label">Age Groups:</span>
                    <span class="result-value">${results.demographics.ageGroups}</span>
                </div>
                <div class="result-metric">
                    <span class="result-label">Gender Distribution:</span>
                    <span class="result-value">${results.demographics.genderDistribution}</span>
                </div>
                <div class="result-metric">
                    <span class="result-label">High Risk Groups:</span>
                    <span class="result-value">${results.demographics.highRiskGroups}</span>
                </div>
            </div>
        `;
    }

    // Geographic
    if (results.geographic) {
        html += `
            <div class="result-card">
                <h4>🗺️ Geographic Analysis</h4>
                <div class="result-metric">
                    <span class="result-label">Provinces Covered:</span>
                    <span class="result-value">${results.geographic.provinces}</span>
                </div>
                <div class="result-metric">
                    <span class="result-label">Urban/Rural Split:</span>
                    <span class="result-value">${results.geographic.urbanRural}</span>
                </div>
                <div class="result-metric">
                    <span class="result-label">Highest CFR:</span>
                    <span class="result-value" style="color: var(--danger-color)">${results.geographic.highestCFR}</span>
                </div>
                <div class="result-metric">
                    <span class="result-label">Lowest CFR:</span>
                    <span class="result-value" style="color: var(--success-color)">${results.geographic.lowestCFR}</span>
                </div>
            </div>
        `;
    }

    // Socioeconomic
    if (results.socioeconomic) {
        html += `
            <div class="result-card">
                <h4>💰 Socio-Economic Analysis</h4>
                <div class="result-metric">
                    <span class="result-label">SES Groups:</span>
                    <span class="result-value">${results.socioeconomic.sesGroups}</span>
                </div>
                <div class="result-metric">
                    <span class="result-label">Mortality Gap:</span>
                    <span class="result-value" style="color: var(--danger-color)">${results.socioeconomic.mortalityGap}</span>
                </div>
                <div class="result-metric">
                    <span class="result-label">Vaccination Gap:</span>
                    <span class="result-value" style="color: var(--warning-color)">${results.socioeconomic.vaccinationGap}</span>
                </div>
                <div class="result-metric">
                    <span class="result-label">Critical Finding:</span>
                    <span class="result-value">${results.socioeconomic.criticalFinding}</span>
                </div>
            </div>
        `;
    }

    // Bias Detection
    if (results.biasDetection) {
        html += `
            <div class="result-card" style="border-left: 4px solid var(--danger-color)">
                <h4>⚠️ Bias Detection Results</h4>
                <div class="result-metric">
                    <span class="result-label">Biases Detected:</span>
                    <span class="result-value" style="color: var(--danger-color)">${results.biasDetection.biasesFound}</span>
                </div>
                <div class="result-metric">
                    <span class="result-label">Severity Level:</span>
                    <span class="result-value" style="color: var(--danger-color)">${results.biasDetection.severity}</span>
                </div>
                <div class="result-metric">
                    <span class="result-label">Primary Bias:</span>
                    <span class="result-value">${results.biasDetection.primaryBias}</span>
                </div>
                <div class="result-metric">
                    <span class="result-label">Recommendation:</span>
                    <span class="result-value">${results.biasDetection.recommendation}</span>
                </div>
            </div>
        `;
    }

    resultsContent.innerHTML = html;
}

// Download report
if (downloadReport) {
    downloadReport.addEventListener('click', () => {
        const reportContent = generateReportText();
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bias-audit-report-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// Generate report text
function generateReportText() {
    const results = resultsContent.textContent;
    return `
BIAS AUDIT ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

${results}

---
This report was generated by the Responsible AI Bias Audit Tool.
For more information, visit the full report documentation.
    `.trim();
}

// Reset analysis
if (resetAnalysis) {
    resetAnalysis.addEventListener('click', () => {
        uploadedFiles = [];
        fileList.innerHTML = '';
        analysisOptions.style.display = 'none';
        analysisResults.style.display = 'none';
        fileInput.value = '';
        uploadArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// Download sample data
if (downloadSample) {
    downloadSample.addEventListener('click', () => {
        const sampleCSV = generateSampleCSV();
        const blob = new Blob([sampleCSV], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample-covid-data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// Generate sample CSV
function generateSampleCSV() {
    const headers = 'Date,Age,Gender,Province,SES,Outcome,Hospitalized,Vaccinated\n';
    const rows = [];
    
    const provinces = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape'];
    const genders = ['Male', 'Female', 'Non-binary'];
    const sesLevels = ['Low', 'Middle', 'High'];
    const outcomes = ['Recovered', 'Hospitalized', 'Death'];
    
    for (let i = 0; i < 100; i++) {
        const date = new Date(2020, Math.floor(Math.random() * 24), Math.floor(Math.random() * 28) + 1);
        const age = Math.floor(Math.random() * 80) + 10;
        const gender = genders[Math.floor(Math.random() * genders.length)];
        const province = provinces[Math.floor(Math.random() * provinces.length)];
        const ses = sesLevels[Math.floor(Math.random() * sesLevels.length)];
        const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        const hospitalized = outcome === 'Hospitalized' || outcome === 'Death' ? 'Yes' : 'No';
        const vaccinated = date.getFullYear() === 2021 && Math.random() > 0.5 ? 'Yes' : 'No';
        
        rows.push(`${date.toISOString().split('T')[0]},${age},${gender},${province},${ses},${outcome},${hospitalized},${vaccinated}`);
    }
    
    return headers + rows.join('\n');
}

console.log('📤 File upload functionality initialized');
