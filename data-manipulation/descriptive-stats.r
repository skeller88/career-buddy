#change blank values to NA, and colnames to same names as database in case manipulation is needed
d <- read.csv('/Users/Shane/career-buddy-data/ep-tables-for-csv.csv', na.strings=c(' ', ''))
library(sqldf)
colnames(d) <- c('career_name', 'career_occ_code', 'career_2012_emp', 'career_2022_emp', 'career_num_emp_change', 'career_percent_emp_change', 'career_percent_self_emp', 'career_job_openings', 'career_med_ann_wage', 'career_edu', 'career_work_exp', 'career_job_training')
d <- d[,1:12]
is.na(d$career_job_training[1000:1091])
write.table(d, file='/Users/Shane/career-buddy-data/ep-tables-cleaned-csv.csv', sep=" ", na="NA", row.names=FALSE, col.names = FALSE)

e <- read.csv('/Users/Shane/career-buddy-data/ep-tables-cleaned-csv.csv')
is.na(e$career_job_training[1000:1091])