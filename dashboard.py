import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# Load dataset (Replace with actual CSV path or dataframe)
@st.cache_data
def load_data():
    df = pd.read_csv("Banglore_traffic_Cleaned.csv")  # Replace with actual dataset
    df['date'] = pd.to_datetime(df['date'])
    return df

df = load_data()

# Sidebar Filters
st.sidebar.header("Filters")
selected_date = st.sidebar.date_input("Select Date", df['date'].min())
selected_area = st.sidebar.multiselect("Select Area", df['area_name'].unique(), df['area_name'].unique())
selected_road = st.sidebar.multiselect("Select Road", df['road/intersection_name'].unique(), df['road/intersection_name'].unique())

# Filter Data
df_filtered = df[(df['date'] == pd.to_datetime(selected_date)) & 
                 (df['area_name'].isin(selected_area)) & 
                 (df['road/intersection_name'].isin(selected_road))]

# KPIs
st.title("🚦 Traffic Dashboard")
st.metric("Total Traffic Volume", df_filtered['traffic_volume'].sum())
st.metric("Avg Speed (km/h)", round(df_filtered['average_speed'].mean(), 2))
st.metric("Avg Congestion Level (%)", round(df_filtered['congestion_level'].mean(), 2))

# Charts
col1, col2 = st.columns(2)

with col1:
    fig1 = px.bar(df_filtered, x='road/intersection_name', y='traffic_volume', color='area_name', title="Traffic Volume by Road")
    st.plotly_chart(fig1, use_container_width=True)

with col2:
    fig2 = px.line(df_filtered, x='road/intersection_name', y='congestion_level', color='area_name', title="Congestion Level Trend")
    st.plotly_chart(fig2, use_container_width=True)

# Additional Insights
st.subheader("🚧 Incident & Environmental Impact Analysis")
fig3 = px.scatter(df_filtered, x='incident_reports', y='environmental_impact', size='traffic_volume', color='area_name', title="Incidents vs Environmental Impact")
st.plotly_chart(fig3, use_container_width=True)

# Traffic Density Heatmap
fig4 = px.density_heatmap(df_filtered, 
                          x='road/intersection_name', 
                          y='area_name', 
                          z='traffic_volume', 
                          color_continuous_scale='Viridis', 
                          title="Traffic Density Heatmap")
st.plotly_chart(fig4, use_container_width=True)

# Traffic Volume vs. Road Capacity Utilization
fig5 = px.scatter(df_filtered, 
                  x='road_capacity_utilization', 
                  y='traffic_volume', 
                  color='area_name', 
                  size='traffic_volume', 
                  title="Traffic Volume vs. Road Capacity Utilization")
st.plotly_chart(fig5, use_container_width=True)

# Parking Usage vs. Traffic Volume
fig6 = px.bar(df_filtered, 
              x='road/intersection_name', 
              y='parking_usage', 
              color='area_name', 
              title="Parking Usage vs. Traffic Volume")
st.plotly_chart(fig6, use_container_width=True)

# Radar Chart for Traffic Factors
traffic_factors = ['congestion_level', 'traffic_signal_compliance', 'environmental_impact', 'parking_usage', 'pedestrian_and_cyclist_count']
area_data = df_filtered.groupby('area_name')[traffic_factors].mean().reset_index()

selected_area_for_radar = st.sidebar.selectbox("Select Area for Radar Chart", area_data['area_name'].unique())
area_data_selected = area_data[area_data['area_name'] == selected_area_for_radar].drop('area_name', axis=1).values.flatten()

fig7 = go.Figure(data=[go.Scatterpolar(
    r=area_data_selected,
    theta=traffic_factors,
    fill='toself',
)])

fig7.update_layout(
    polar=dict(
        radialaxis=dict(
            visible=True,
            range=[0, 100]
        )
    ),
    title=f"Traffic Factors for {selected_area_for_radar}",
    showlegend=False
)

st.plotly_chart(fig7, use_container_width=True)

# Pedestrian & Cyclist Count Line Chart
fig8 = px.line(df_filtered, 
               x='road/intersection_name', 
               y='pedestrian_and_cyclist_count', 
               color='area_name', 
               title="Pedestrian & Cyclist Count Over Roads")
st.plotly_chart(fig8, use_container_width=True)

# Traffic Volume Distribution Box Plot
fig9 = px.box(df_filtered, 
              x='road/intersection_name', 
              y='traffic_volume', 
              color='area_name', 
              title="Traffic Volume Distribution Across Roads")
st.plotly_chart(fig9, use_container_width=True)

# Display Data Table
st.subheader("📊 Data Table")
st.dataframe(df_filtered)
