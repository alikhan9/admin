import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections

import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { useEffect, useState } from 'react';
import { get200HttpRequests, get404HttpRequests, getApiHealth, getDiskFreeSpace, getDiskTotal } from './../client';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();

  const [health, setHealth] = useState({});

  const [requests200, setRequests200] = useState({});

  const [requests404, setRequests404] = useState({});

  const [distFree, setDiskFree] = useState(0);

  const [diskTotal, setDiskTotal] = useState(0);

  const navigate = useNavigate();


  useEffect(() => {
    getApiHealth().then(response => {
      response.data.status ? setHealth(response.data) : navigate('/', { replace: true });
    })
      .catch((err) => navigate('/', { replace: true }));

    get200HttpRequests().then(response => {
      setRequests200(response.data);
    }).catch((err) => navigate('/', { replace: true }));

    get404HttpRequests().then(response => {
      setRequests404(response.data);
    }).catch((err) => navigate('/', { replace: true }));

    getDiskFreeSpace().then(response => {
      setDiskFree(response.data);
    }).catch((err) => navigate('/', { replace: true }));

    getDiskTotal().then(response => {
      setDiskTotal(response.data);
    }).catch((err) => navigate('/', { replace: true }));
  }, [])

  return (
    <Page title="Dashboard">
      <Container maxWidth="xxl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="API Health" total={health?.status || '...'} icon={'ant-design:appstore-outlined'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Database Health" total={health?.components?.db.status || '...'} color="info" icon={'ant-design:database-outlined'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Http 200" total={requests200?.measurements?.[0].value || '...'} color="success" icon={'ant-design:pull-request-outlined'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Http 404" total={requests404?.measurements?.[0].value || '...'} color="warning" icon={'ant-design:bug-filled'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              chartLabels={[
                '01/01/2022',
                '02/01/2022',
                '03/01/2022',
                '04/01/2022',
                '05/01/2022',
                '06/01/2022',
                '07/01/2022',
                '08/01/2022',
                '09/01/2022',
                '10/01/2022',
                '11/01/2022',
              ]}
              chartData={[
                {
                  name: 'Visitors',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Disk (Gb)"
              chartData={[
                { label: 'Free', value: distFree?.measurements?.[0].value/1000000 || 1 },
                { label: 'Used', value: diskTotal?.measurements?.[0].value/1000000 || 1 },
              ]}
              chartColors={[
                theme.palette.chart.green[0],
                theme.palette.chart.violet[0],
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
