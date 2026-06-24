import { TitleSlide, AgendaSlide, WhatIsHPESlide, WhatIsHMRSlide, ChallengesSlide } from './S00_Intro.jsx'
import { SMPLExplorerSlide } from './SMPLExplorer.jsx'
import {
  LiDARAdvantageSlide, SensorTaxonomySlide,
  LiDARBasicsSlide, ScanningPatternsSlide, LiDARTaxonomySlide,
  SensorComparisonSlide, LiDARLimitationsSlide, EarlyDatasetsSlide, GrowingInterestSlide
} from './S02_Background.jsx'
import {
  SurveyContribsSlide, TaxonomySlide, MethodsSummarySlide,
  ModalityLearningSlide, ArchitecturesSlide, ArchitecturesSMPLSlide,
  SyntheticDataSlide, PretrainingSlide
} from './S03_Overview.jsx'
import {
  HPECategoriesSlide, SparsityConsciousSlide, DAPTUniPVUSlide,
  AuxiliarySupervisionSlide, WSHPEOverviewSlide, WSMethodsSlide,
  FusionStrategiesSlide, UnsupervisedHPESlide
} from './S04_HPE.jsx'
import {
  HMRCategoriesSlide, SparseToDenseSlide, SpatioTemporalHMRSlide,
  CommonHMRPipelineSlide, ReMPSlide, MultimodalHMRSlide, OptimizationPipelinesSlide
} from './S05_HMR.jsx'
import {
  DatasetsOverviewSlide, WODSlide, SLOPER4DSlide,
  HumanM3Slide, DatasetStatsSlide, OtherDatasetsSlide
} from './S06_Datasets.jsx'
import {
  MetricsIntroSlide, MPJPESlide, PCKPEMSlide,
  MeshMetricsSlide
} from './S07_Benchmarks.jsx'
import { FutureDirectionsSlide, SummarySlide } from './S08_Future.jsx'

export const allSlides = [
  /* ── Introduction (5 slides) ─────────────────── */
  { id: 's0-title',      section: 'Introduction', title: 'Title',                          accent: '#06b6d4', component: TitleSlide },
  { id: 's0-agenda',     section: 'Introduction', title: 'Tutorial Overview',               accent: '#06b6d4', component: AgendaSlide },
  { id: 's0-hpe',        section: 'Introduction', title: '3D HPE from LiDAR',               accent: '#3b82f6', component: WhatIsHPESlide },
  { id: 's0-hmr',        section: 'Introduction', title: '3D HMR from LiDAR',               accent: '#3b82f6', component: WhatIsHMRSlide },
  { id: 's0-smpl-exp',  section: 'Introduction', title: 'SMPL Interactive Explorer',        accent: '#3b82f6', component: SMPLExplorerSlide },
  { id: 's0-challenges', section: 'Introduction', title: 'LiDAR Challenges',                accent: '#3b82f6', component: ChallengesSlide },

  /* ── §2 Background (10 slides) ───────────────── */
  // { id: 's2-hpe-img', section: '§2 Background', title: 'HPE/HMR from Images', accent: '#8b5cf6', component: BackgroundHPEImgSlide },
  { id: 's2-lidar-adv', section: '§2 Background', title: 'The LiDAR Advantage',             accent: '#8b5cf6', component: LiDARAdvantageSlide },
  { id: 's2-sensors',   section: '§2 Background', title: 'Passive vs Active Sensors',       accent: '#8b5cf6', component: SensorTaxonomySlide },
  { id: 's2-lidar-bas', section: '§2 Background', title: 'LiDAR Technology Basics',         accent: '#8b5cf6', component: LiDARBasicsSlide },
  { id: 's2-patterns',  section: '§2 Background', title: 'Scanning Patterns (RMB vs NRS)',  accent: '#8b5cf6', component: ScanningPatternsSlide },
  { id: 's2-taxonomy',  section: '§2 Background', title: 'LiDAR Sensor Taxonomy',           accent: '#8b5cf6', component: LiDARTaxonomySlide },
  { id: 's2-comparison',section: '§2 Background', title: 'Sensor Comparison',               accent: '#8b5cf6', component: SensorComparisonSlide },
  { id: 's2-limits',    section: '§2 Background', title: 'LiDAR Limitations',               accent: '#8b5cf6', component: LiDARLimitationsSlide },
  { id: 's2-datasets',  section: '§2 Background', title: 'Enabling Datasets',               accent: '#8b5cf6', component: EarlyDatasetsSlide },
  { id: 's2-growth',    section: '§2 Background', title: 'Growing Research Interest',       accent: '#8b5cf6', component: GrowingInterestSlide },

  /* ── §3 Overview (7 slides) ─────────────────── */
  { id: 's3-contribs',  section: '§3 Overview', title: 'Survey Contributions',             accent: '#06b6d4', component: SurveyContribsSlide },
  { id: 's3-taxonomy',  section: '§3 Overview', title: 'Method Taxonomy',                  accent: '#06b6d4', component: TaxonomySlide },
  { id: 's3-methods',   section: '§3 Overview', title: 'Methods at a Glance',              accent: '#06b6d4', component: MethodsSummarySlide },
  { id: 's3-modality',  section: '§3 Overview', title: 'Modality × Supervision',           accent: '#06b6d4', component: ModalityLearningSlide },
  { id: 's3-arch',      section: '§3 Overview', title: 'Architectures: PC Representations',  accent: '#06b6d4', component: ArchitecturesSlide },
  { id: 's3-arch-smpl', section: '§3 Overview', title: 'Architectures: Temporal & SMPL',    accent: '#06b6d4', component: ArchitecturesSMPLSlide },
  { id: 's3-synth',     section: '§3 Overview', title: 'Synthetic Data Generation',          accent: '#06b6d4', component: SyntheticDataSlide },
  { id: 's3-pretrain',  section: '§3 Overview', title: 'Pre-training Strategy',            accent: '#06b6d4', component: PretrainingSlide },

  /* ── §4 HPE from LiDAR (8 slides) ───────────── */
  { id: 's4-cats',      section: '§4 HPE', title: 'HPE Categories',                       accent: '#10b981', component: HPECategoriesSlide },
  { id: 's4-sparsity',  section: '§4 HPE', title: 'Sparsity-conscious Design',             accent: '#10b981', component: SparsityConsciousSlide },
  { id: 's4-dapt',      section: '§4 HPE', title: 'DAPT & UniPVU-Human',                  accent: '#10b981', component: DAPTUniPVUSlide },
  { id: 's4-aux',       section: '§4 HPE', title: 'Supervision Beyond Pose',               accent: '#10b981', component: AuxiliarySupervisionSlide },
  { id: 's4-ws-ov',     section: '§4 HPE', title: 'Weakly-supervised HPE: Overview',      accent: '#10b981', component: WSHPEOverviewSlide },
  { id: 's4-ws-methods',section: '§4 HPE', title: 'Weakly-supervised HPE: Methods',       accent: '#10b981', component: WSMethodsSlide },
  { id: 's4-fusion',    section: '§4 HPE', title: 'Fusion Strategies',                    accent: '#10b981', component: FusionStrategiesSlide },
  { id: 's4-unsup',     section: '§4 HPE', title: 'Unsupervised HPE: GC-KPL',             accent: '#10b981', component: UnsupervisedHPESlide },

  /* ── §5 HMR from LiDAR (7 slides) ───────────── */
  { id: 's5-cats',      section: '§5 HMR', title: 'HMR Categories',                       accent: '#f59e0b', component: HMRCategoriesSlide },
  { id: 's5-sparse2dense',section:'§5 HMR', title: 'Sparse-to-Dense: LiDAR-HMR',          accent: '#f59e0b', component: SparseToDenseSlide },
  { id: 's5-st',        section: '§5 HMR', title: 'Spatio-temporal Modeling',             accent: '#f59e0b', component: SpatioTemporalHMRSlide },
  { id: 's5-pipeline',  section: '§5 HMR', title: 'Common HMR Pipeline',                  accent: '#f59e0b', component: CommonHMRPipelineSlide },
  { id: 's5-remp',      section: '§5 HMR', title: 'ReMP: Distillation Prior',             accent: '#f59e0b', component: ReMPSlide },
  { id: 's5-multimodal',section: '§5 HMR', title: 'Multi-modal HMR',                      accent: '#f59e0b', component: MultimodalHMRSlide },
  { id: 's5-optim',     section: '§5 HMR', title: 'Optimization Pipelines',               accent: '#f59e0b', component: OptimizationPipelinesSlide },

  /* ── §6 Datasets (6 slides) ─────────────────── */
  { id: 's6-overview',  section: '§6 Datasets', title: 'Datasets Overview',               accent: '#ef4444', component: DatasetsOverviewSlide },
  { id: 's6-wod',       section: '§6 Datasets', title: 'Waymo Open Dataset',              accent: '#ef4444', component: WODSlide },
  { id: 's6-sloper',    section: '§6 Datasets', title: 'SLOPER4D',                        accent: '#ef4444', component: SLOPER4DSlide },
  { id: 's6-humanm3',   section: '§6 Datasets', title: 'Human-M3',                        accent: '#ef4444', component: HumanM3Slide },
  { id: 's6-stats',     section: '§6 Datasets', title: 'Comparative Analysis',             accent: '#ef4444', component: DatasetStatsSlide },
  { id: 's6-others',    section: '§6 Datasets', title: 'Other Public Datasets',            accent: '#ef4444', component: OtherDatasetsSlide },

  /* ── §7 Benchmarks & Metrics (7 slides) ─────── */
  { id: 's7-intro',     section: '§7 Benchmarks', title: 'Metrics Overview',              accent: '#ec4899', component: MetricsIntroSlide },
  { id: 's7-mpjpe',     section: '§7 Benchmarks', title: 'MPJPE & PA-MPJPE',             accent: '#ec4899', component: MPJPESlide },
  { id: 's7-pck',       section: '§7 Benchmarks', title: 'PCK, PEM & OKS',               accent: '#ec4899', component: PCKPEMSlide },
  { id: 's7-mesh',      section: '§7 Benchmarks', title: 'Mesh Metrics',                  accent: '#ec4899', component: MeshMetricsSlide },

  /* ── §8 Future + Closing (2 slides) ─────────── */
  { id: 's8-future',    section: '§8 Future', title: 'Future Directions',                 accent: '#6366f1', component: FutureDirectionsSlide },
  { id: 's8-summary',   section: 'Closing',   title: 'Summary & Thank You',               accent: '#6366f1', component: SummarySlide },
]

export default allSlides
