import {
  DisplayProcessor,
  SpecReporter,
  StacktraceOption
} from 'jasmine-spec-reporter';
import StartedInfo = jasmine.JasmineStartedInfo;
import CustomReporterResult = jasmine.SuiteResult;

class CustomProcessor extends DisplayProcessor {
  public displayJasmineStarted(info: StartedInfo, log: string): string {
    return `${log}`;
  }
  public displaySuite(suite: CustomReporterResult, log: string): string {
    return this.theme.prettyStacktraceFilename(log);
  }
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
  new SpecReporter({
    spec: {
      displayStacktrace: StacktraceOption.NONE
    },
    suite: {
      displayNumber: true
    },
    customProcessors: [CustomProcessor]
  })
);
