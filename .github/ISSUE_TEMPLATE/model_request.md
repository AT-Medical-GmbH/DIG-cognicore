---
name: AI/ML Model Request
about: Request a new AI/ML model integration or an improvement to an existing model
title: "[MODEL] "
labels: ai-ml, enhancement
assignees: ""
---

## Model Request Summary

<!-- Describe the AI/ML model or capability you are requesting. -->

## Use Case

<!-- What problem does this model solve? Which CogniCore™ feature does it improve or enable?
     Examples: speech recognition accuracy, caption quality, translation, sentiment analysis. -->

## Current Behaviour / Baseline

<!-- How is the current model or approach performing? Include metrics if available. -->

## Proposed Model / Approach

<!-- Name the model, provider, or algorithm you are proposing.
     Examples: OpenAI Whisper large-v3, Azure Speech-to-Text v3, custom fine-tuned BERT. -->

| Field | Details |
| --- | --- |
| Model name / provider | |
| Model type | (ASR / NLP / Translation / CV / Other) |
| Hosting | (Cloud API / Self-hosted / Edge) |
| Open source / proprietary | |
| License | |

## Performance Requirements

<!-- Specify target metrics where applicable. -->

| Metric | Current | Target |
| --- | --- | --- |
| Accuracy / WER / BLEU | | |
| Latency (p99) | | |
| Throughput (req/s) | | |
| Memory footprint | | |

## Data & Privacy Considerations

<!-- Describe the data the model will process.
     - Does it process patient data or personally identifiable information (PII)?
     - Is the data sent to a third-party API?
     - GDPR Article 22 implications (automated decision-making)? -->

- [ ] Processes PII / patient data
- [ ] Data sent to third-party provider
- [ ] GDPR Article 22 review required
- [ ] Data stays on-premises / within EU

## Training / Fine-tuning Requirements

<!-- If the model requires custom training or fine-tuning, describe the dataset, labelling needs, and compute requirements. -->

## Integration Points

<!-- Which services or packages in the monorepo will be affected?
     Examples: `services/caption/`, `packages/types/`, `apps/api/`. -->

- [ ] `services/caption/` (CogniCaption ASR worker)
- [ ] `services/recorder/` (CogniCapture media pipeline)
- [ ] `apps/api/` (NestJS REST / WebSocket)
- [ ] Other: <!-- specify -->

## Evaluation Plan

<!-- How will the model be evaluated before production rollout?
     Include A/B testing strategy, benchmark datasets, and success thresholds. -->

## Rollback Plan

<!-- How can the new model be rolled back if quality degrades in production? -->

## Additional Context

<!-- Any papers, links, or prior art. -->
